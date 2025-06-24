import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {agents} from "@/db/schema";



export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ()=>{
        const data = await db.select().from(agents);

    //await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate a delay for demonstration purposes
    //throw new Error("Simulated error for testing purposes");
        return data;
    })
})  