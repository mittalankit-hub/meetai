import { LogInIcon } from "lucide-react"
import { DefaultVideoPlaceholder,StreamVideoParticipant,ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk"
//import { Link } from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { generateAvaterUri } from "@/lib/avatar"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import Link from "next/link"

interface Props {
    onJoin: ()=>void;
};


const DisabledVideoPreview =()=>{
    const {data} = authClient.useSession()
    return(
        <DefaultVideoPlaceholder participant={
            {
                name:data?.user.name ?? "",
                image:data?.user.image ?? generateAvaterUri({seed: data?.user.name ?? "",variant: "initials"})
            } as StreamVideoParticipant
        }/>
    )
}

const AllowBrowserPermission = ()=>{
    return(
        <p className="text-sm">
            Please grant your browser a permisson to access your camera and microphone.
        </p>
    )
}

export const CallLoby = ({onJoin}:Props)=>{
    const {useCameraState, useMicrophoneState} = useCallStateHooks()

    const {hasBrowserPermission:hasMicPermission} = useMicrophoneState()
    const {hasBrowserPermission:hasCameraPermission} = useCameraState()
    console.log("hasMicPermission: ",hasMicPermission)
    console.log("hasCameraPermission: ",hasCameraPermission)

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission
    console.log("hasBrowserMediaPermission: ",hasBrowserMediaPermission)

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center ">
                        <h6 className="text-lg font-medium">Ready to Join?</h6>
                        <p className="text-sm">Set up your call before joining</p>
                    </div>
                    <VideoPreview DisabledVideoPreview={
                        hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermission
                    }/>
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost">
                            <Link href="/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button onClick={onJoin}>
                            <LogInIcon/>
                            Join Call
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
