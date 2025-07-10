"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query"
import { AgentIdViewHeader } from "../components/agent-id-view-header"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { VideoIcon } from "lucide-react"
import { useState } from "react"
import { AgentEditDialog } from "../components/edit-agent-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/hooks/use-confirm"


interface Props{
    agentId : string
}

export const AgentIdView = ({ agentId }: Props) => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))
    const [updateDialogOpen, setUpdateIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    
    
    const removeAgent = useMutation(
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
    
    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure you want to delete this agent?",
        `This following action will ${data.meetingCount} meeting associated with this agent.`,

    )
    const handleRemoveAgent = async()=>{
        console.log("Inside handleRemove: Removing agent with ID:", agentId);
        const ok = await confirmRemove();
        console.log("Inside handleRemove Confirmation result:", ok);
        if(!ok) return;
        await removeAgent.mutateAsync({id: agentId})
    }

    //const isPending = removeAgent.isPending

    // if(isPending){
    //     return(
    //         <LoadingState title="Deleting Agent" description="Please wait while we delete the agent..." />
    //     )
    // }

    return(
        
    <>
        <RemoveConfirmation />
        <AgentEditDialog open={updateDialogOpen} onOpenChange={setUpdateIsDialogOpen} initialValues={data}/>
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <AgentIdViewHeader 
                agentId={agentId}
                agentName={data.name}
                onEdit = {()=>{setUpdateIsDialogOpen(true)}}
                onRemove = {handleRemoveAgent}
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