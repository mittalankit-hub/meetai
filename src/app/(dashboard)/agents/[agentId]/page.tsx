import { auth } from "@/lib/auth";
import { AgentIdErrorView, AgentIdLoadingView, AgentIdView } from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props{
    params: Promise<{agentId:string}>
}

const Page = async ({params}:Props)=>{
    const {agentId} = await params;
    const session = await auth.api.getSession({
           headers: await headers(),
        });
        
    if(!session) {
          redirect("/sign-in");
        }
    const queryClient = getQueryClient()
    queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({id:agentId}))
    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdLoadingView />}>
                <ErrorBoundary fallback={<AgentIdErrorView />}>
                    <AgentIdView agentId={agentId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        
    )
}
export default Page