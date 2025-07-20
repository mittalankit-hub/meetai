import { db } from "@/db";
import {count, eq} from "drizzle-orm"
import { agents, meetings } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter,protectedProcedure } from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
    getFreeUsage:protectedProcedure.query(async({ctx})=>{
        const customer = await polarClient.customers.getStateExternal({
            externalId:ctx.auth.user.id
        })
        const subscriptions = customer.activeSubscriptions[0]
        if(subscriptions){
            return null
        }
        const [userMeetings] = await db.select({count:count(meetings.id)}).from(meetings).where(eq(meetings.userId,ctx.auth.user.id))
        const [userAgents] = await db.select({count:count(agents.id)}).from(agents).where(eq(agents.userId,ctx.auth.user.id))

        return{
            meetingsCount:userMeetings.count,
            agentsCount:userAgents.count
        }
    }),

    getProducts: protectedProcedure.query(async()=>{
        const products = await polarClient.products.list({
            isArchived:false,
            isRecurring:true,
            sorting:["price_amount"]
        })
        return products.result.items
    }),

    getCurrentSubscription:protectedProcedure.query(async({ctx})=>{
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id
        })
        const subscriptions = customer.activeSubscriptions[0]
        if(!subscriptions){
            return null
        }
        const product = await polarClient.products.get({
            id:subscriptions.productId
        })
        return product
    })
   
})