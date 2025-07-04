"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query"
import { AgentIdViewHeader } from "../components/agent-id-view-header"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { VideoIcon } from "lucide-react"
import { use, useState } from "react"
import { AgentEditDialog } from "../components/edit-agent-dialog"
import { set } from "date-fns"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"


interface Props{
    agentId : string
}

export const AgentIdView = ({ agentId }: Props) => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    
    
    const removedAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess:async () =>{
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
               // invalidate free tier usage

                router.push("/agents")
            
            },
            onError: (error) => {
                toast.error(error.message)
            },

            //TODO: check if error code FORBIDDEN , redirect to /upgrade
        })
    )
    const isPending = removedAgent.isPending

    if(isPending){
        return(
            <LoadingState title="Deleting Agent" description="Please wait while we delete the agent..." />
        )
    }

    return(
        
    <>
        <AgentEditDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} data={data}/>
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <AgentIdViewHeader 
                agentId={agentId}
                agentName={data.name}
                onEdit = {()=>{setIsDialogOpen(true)}}
                onRemove = {()=>removedAgent.mutate({id: agentId})}
                />

        <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                <div className="flex items-center gap-x-3 ">
                    <GeneratedAvatar 
                    variant="botttsNeutral"
                    seed={data.name}
                    className="size-10"
                    />
                    <h2 className="text-2xl font-medium">
                        {data.name}
                    </h2>
                </div>
                <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                   <VideoIcon className="text-blue-700"/>   
                   {data.meetingCount}{ data.meetingCount === 1 ? " Meeting" : " Meetings"}
                </Badge>
                <div className="flex flex-col gap-y-4">
                    <p className="text-l font-medium">Instructions</p>
                    <p className="text-neutral-800">{data.instructions}</p>
                </div>
            </div>

        </div>
    </div>
    </>
    )
}

export const AgentIdLoadingView = () => {
    return (
        <LoadingState title="Loading Agent" description="This may take a few seconds...." />
    )
}

export const AgentIdErrorView = () => {
    return (
        <ErrorState title="Error Loading Agent" description="Please try again later" />
    )
}

export default AgentIdView