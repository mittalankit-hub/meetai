import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { and,count,desc,eq, getTableColumns, ilike } from "drizzle-orm";
import z from "zod";
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, PAGE_SIZE_MAX, PAGE_SIZE_MIN } from "@/constants";
import { TRPCError } from "@trpc/server";



export const meetingsRouter = createTRPCRouter({
  
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
                })
            )
            .query(async ({ctx,input})=>{
                const{search,page,pageSize} = input;
                const data = await db
                    .select(
                    {
                        
                        ...getTableColumns(meetings)
                    })
                    .from(meetings)
                    .where(
                        and(
                            eq(meetings.userId,ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined
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