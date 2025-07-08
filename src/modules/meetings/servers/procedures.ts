import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { meetings, meetingStatus } from "@/db/schema";
import { and,count,desc,eq, getTableColumns, ilike } from "drizzle-orm";
import z from "zod";
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, PAGE_SIZE_MAX, PAGE_SIZE_MIN } from "@/constants";
import { TRPCError } from "@trpc/server";
import { MeetingInsertSchema, MeetingUpdateSchema } from "../schema";



export const meetingsRouter = createTRPCRouter({

    create: protectedProcedure.input(MeetingInsertSchema).mutation(async ({input,ctx})=>{

        const [createdMeeting] = await db.insert(meetings).values({
            ...input,
            userId: ctx.auth.user.id,
           
        }).returning();
        // TODO : Create Stream Call, Upsert Stream Users
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
                ...getTableColumns(meetings)}).from(meetings).where(
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
    
    
    
        getMany: protectedProcedure
            .input(z.object({
                page: z.number().default(DEFAULT_PAGE_NUM),
                pageSize: z.number().min(PAGE_SIZE_MIN).max(PAGE_SIZE_MAX).default(DEFAULT_PAGE_SIZE),
                search:z.string().nullish(),
                status: z.enum(meetingStatus.enumValues).nullish(),
                })
            )
            .query(async ({ctx,input})=>{
                const{search,page,pageSize,status} = input;
                const data = await db
                    .select(
                    {
                        
                        ...getTableColumns(meetings)
                    })
                    .from(meetings)
                    .where(
                        and(
                            eq(meetings.userId,ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined,
                            status ? eq(meetings.status, status) : undefined
                        )
                    )
                    .orderBy(desc(meetings.createdAt),desc(meetings.id))
                    .limit(pageSize)
                    .offset( (page-1) * pageSize );
    
                    const [total] = await db
                    .select({count: count()})
                    .from(meetings)
                    .where(
                        and(
                            eq(meetings.userId,ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined
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



})