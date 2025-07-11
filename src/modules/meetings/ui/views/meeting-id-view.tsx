"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query"
import { GeneratedAvatar } from "@/components/generated-avatar"
// import { Badge } from "@/components/ui/badge"
// import { VideoIcon } from "lucide-react"
import { useState } from "react"
import {  MeetingEditDialog } from "../components/edit-meeting-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/hooks/use-confirm"
import { MeetingIdViewHeader } from "../components/meeting-id-view-header"


interface Props{
    meetingId : string
}

export const MeetingIdView = ({ meetingId }: Props) => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))
    const [updateDialogOpen, setUpdateIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    
    
    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess:async () =>{
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))

               // invalidate free tier usage

                router.push("/meetings")
            
            },
            onError: (error) => {
                toast.error(error.message)
            },

            //TODO: check if error code FORBIDDEN , redirect to /upgrade
        })
    )
    
    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure you want to delete this meeting?",
        `This following action will remove meeting ${data.name}.`,

    )
    const handleRemoveMeeting = async()=>{
        console.log("Inside handleRemove: Removing meeting with ID:", meetingId);
        const ok = await confirmRemove();
        console.log("Inside handleRemove Confirmation result:", ok);
        if(!ok) return;
        await removeMeeting.mutateAsync({id: meetingId})
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
        <MeetingEditDialog open={updateDialogOpen} onOpenChange={setUpdateIsDialogOpen} initialValues={data}/>
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                meetingId={meetingId}
                meetingName={data.name}
                onEdit = {()=>{setUpdateIsDialogOpen(true)}}
                onRemove = {handleRemoveMeeting}
                />

        <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                <div className="flex items-center gap-x-3 ">

                    <h2 className="text-2xl font-medium">
                        {data.name}
                    </h2>
                </div>
                {/* <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                   <VideoIcon className="text-blue-700"/>   
                   {data.meetingCount}{ data.meetingCount === 1 ? " Meeting" : " Meetings"}
                </Badge> */}
                <div className="flex flex-col gap-y-4">
                    <p className="text-l font-medium">Agent</p>
                    
                    <p className="text-neutral-800">
                        <GeneratedAvatar 
                        variant="botttsNeutral"
                        seed={data.agent.name}
                        className="size-10"
                        />
                        
                        {data.agent.name}</p>
                </div>
            </div>

        </div>
    </div>
    </>
    )
}

export const MeetingIdLoadingView = () => {
    return (
        <LoadingState title="Loading Meeting" description="This may take a few seconds...." />
    )
}

export const MeetingIdErrorView = () => {
    return (
        <ErrorState title="Error Loading Meeting" description="Please try again later" />
    )
}

export default MeetingIdView