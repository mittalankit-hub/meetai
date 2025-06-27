import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {agents} from "@/db/schema";
import { AgentInsertSchema } from "../schema";
import z from "zod";
import { eq } from "drizzle-orm";



export const agentsRouter = createTRPCRouter({

     getOne: protectedProcedure.input(z.object({id:z.string()})).query(async ({input})=>{
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));

        return existingAgent;
    }),



    getMany: protectedProcedure.query(async ()=>{
        const data = await db.select().from(agents);

    //await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate a delay for demonstration purposes
    //throw new Error("Simulated error for testing purposes");
        return data;
    }),

    create: protectedProcedure.input(AgentInsertSchema).mutation(async ({input,ctx})=>{

        const [createdAgent] = await db.insert(agents).values({
            ...input,
            userId: ctx.auth.user.id,
           
        }).returning();
        return createdAgent;
    })
})  