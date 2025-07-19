import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { and,count,desc,eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";
import z from "zod";
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, PAGE_SIZE_MAX, PAGE_SIZE_MIN } from "@/constants";
import { TRPCError } from "@trpc/server";
import { MeetingInsertSchema, MeetingUpdateSchema } from "../schema";
import { MeetingStatus, StreamTranscription } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvaterUri } from "@/lib/avatar";
import { name } from "@stream-io/video-react-sdk";
import { streamChat } from "@/lib/stream-chat";



export const meetingsRouter = createTRPCRouter({

    generateToken: protectedProcedure.mutation(async ({ctx})=>{
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image: ctx.auth.user.image ?? generateAvaterUri({
                    seed: ctx.auth.user.name,
                    variant: "initials"
                })
            }
        ])

        const expirationTime = Math.floor(Date.now() / 1000) + 3600
        const issuedAt = Math.floor(Date.now() / 1000) - 60

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issuedAt,
        })

        return token
    }),

    create: protectedProcedure.input(MeetingInsertSchema).mutation(async ({input,ctx})=>{

        const [createdMeeting] = await db.insert(meetings).values({
            ...input,
            userId: ctx.auth.user.id,
           
        }).returning();
        // TODO : Create Stream Call, Upsert Stream Users

        const call = streamVideo.video.call("default", createdMeeting.id);
        
        await call.create({
            data:{
                created_by_id: ctx.auth.user.id,
                custom: 
                {
                    meetingId: createdMeeting.id,
                    meetingName: createdMeeting.name,
                },
                settings_override: {
                    transcription: 
                    {
                        language: "en",
                        mode: "auto-on",
                        closed_caption_mode:"auto-on",      
                    },
                    recording: {
                        mode: "auto-on",
                        quality: "1080p",
                    },
        }}})

        const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));   

        if (!existingAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Agent with id ${createdMeeting.agentId} not found`,
            });
        }

        await streamVideo.upsertUsers([
            {
                id: existingAgent.id,
                name: existingAgent.name,
                role: "user",
                image: generateAvaterUri({
                    seed: existingAgent.name,
                    variant: "botttsNeutral"
                })
            }
        ])

        return createdMeeting;
    }),

    update: protectedProcedure.input(MeetingUpdateSchema).mutation(async ({input,ctx})=>{

        const [updatedMeeting] = await db.update(meetings)
            .set(input)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id)
                )
            )
            .returning();

            if(!updatedMeeting)
                {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Meeting not found.`,
                    })
                }
        return updatedMeeting;
    }),
  
    getOne: protectedProcedure.input(z.object({id:z.string()})).query(async ({input,ctx})=>{
        const [existingMeeting] = await db.select(
            // TODO: change to actual count
            { 
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (meetings."ended_at" - meetings."started_at"))`.as("duration"),})
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id)) 
            .where(
                and(eq(meetings.id, input.id),
                    eq(meetings.userId,ctx.auth.session.userId)
                   ));
        if (!existingMeeting) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Meeting with id ${input.id} not found`,
        });
    }
        return existingMeeting;
    }),
    
    
    getMany: protectedProcedure.input(z.object({
                page: z.number().default(DEFAULT_PAGE_NUM),
                pageSize: z.number().min(PAGE_SIZE_MIN).max(PAGE_SIZE_MAX).default(DEFAULT_PAGE_SIZE),
                search:z.string().nullish(),
                status:z.enum([
                    MeetingStatus.Upcoming,
                    MeetingStatus.Active,
                    MeetingStatus.Completed,
                    MeetingStatus.Cancelled,
                    MeetingStatus.Processing,
                ]).nullish(),
                agentId: z.string().nullish(),
            }))
            .query(async ({ctx,input})=>{
                const{search,page,pageSize,status,agentId} = input;
                const data = await db
                    .select(
                    {
                        
                        ...getTableColumns(meetings),
                        agent: agents,
                        duration: sql<number>`EXTRACT(EPOCH FROM (meetings."ended_at" - meetings."started_at"))`.as("duration"),
                    })
                    .from(meetings)
                    .innerJoin(agents, eq(meetings.agentId, agents.id)) 
                    .where(
                        and(
                            eq(meetings.userId,ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined,
                            status ? eq(meetings.status, status) : undefined,
                            agentId ? eq(meetings.agentId, agentId) : undefined
                        )
                    )
                    .orderBy(desc(meetings.createdAt),desc(meetings.id))
                    .limit(pageSize)
                    .offset( (page-1) * pageSize );
    
                    const [total] = await db
                    .select({count: count()})
                    .from(meetings)
                    .innerJoin(agents, eq(meetings.agentId, agents.id))
                    .where(
                        and(
                            eq(meetings.userId,ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined,
                            status ? eq(meetings.status, status) : undefined,
                            agentId ? eq(meetings.agentId, agentId) : undefined
                        )
                    )
    
                    const totalPages  = Math.ceil(total.count / pageSize)
    
                //await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate a delay for demonstration purposes
                //throw new Error("Simulated error for testing purposes");
                return {
                    items:data,
                    total:total.count,
                    totalPages: totalPages,
                };
                }
            ),

    remove: protectedProcedure.input(z.object({id:z.string()})).mutation(async ({input,ctx})=>{
        const removedMeeting = await db.delete(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id)
                )
            ).returning();

            if(!removedMeeting)
            {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Agent not found.`,
                })
            }
        return removedMeeting
    }),


    getTranscript: protectedProcedure.input(z.object({id:z.string()})).query(async ({input,ctx})=>{
        const [existingMeeting] = await db.select()
            .from(meetings)
            .where(
                and(eq(meetings.id, input.id),
                    eq(meetings.userId,ctx.auth.session.userId)
                   ));
        if (!existingMeeting) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Meeting with id ${input.id} not found`,
        });
    }

    if (!existingMeeting.transcriptUrl) {
        return []
    }

    const transcript: StreamTranscription[] = await fetch(existingMeeting.transcriptUrl)
        .then((res) => res.text())
        .then((text) => JSONL.parse<StreamTranscription>(text))
        .catch(() => []);
    const speakerIds = [...new Set(transcript.map((item: StreamTranscription) => item.speaker_id))];
    const useSpeakers = await db.select().from(user).where(inArray(user.id,speakerIds)).then((users)=> users.map((user)=>({...user,image:user.image ?? generateAvaterUri({seed: user.name,variant:"initials"})})))
    const agentSpeakers = await db.select().from(agents).where(inArray(agents.id,speakerIds)).then((agents)=> agents.map((agent)=>({...agent,image: generateAvaterUri({seed: agent.name,variant:"botttsNeutral"})})))
    const speakers = [...useSpeakers, ...agentSpeakers]
    
    const transcriptWithSpeakers = transcript.map((item)=>{
        const speaker = speakers.find((speaker)=>speaker.id === item.speaker_id)
        if(!speaker){
            return{...item ,user:{name:"Unknown",image:generateAvaterUri({seed:"Unknown",variant:"initials"})}}
        }
        return {...item ,user:{name:speaker.name,image:speaker.image}}
    })

    return transcriptWithSpeakers;
    }),

    generateChatToken: protectedProcedure.mutation(async ({ctx})=>{
        const token = streamChat.createToken(ctx.auth.user.id)
        await streamChat.upsertUser({
            id:ctx.auth.user.id,
            role:"admin"
        })
        return token
    })
})