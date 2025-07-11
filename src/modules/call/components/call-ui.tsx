import { useState } from "react";
import {StreamTheme, useCall} from "@stream-io/video-react-sdk"
import { CallLoby } from "./call-lobby";

interface Props {
    meetingName:string;
}

export const CallUI = ({meetingName}:Props)=>{

    const call = useCall()
    const [show,setShow] = useState<"lobby" | "call" | "ended">("lobby")

    const handleJoin = async ()=>{
        if(!call) return;
        await call.join()
        setShow("call")
    }

    const handleLeave = async ()=>{
        if(!call) return;
        await call.leave()
        setShow("ended")
    }

    return(
        <StreamTheme className="h-full">
            {show==="lobby" && <CallLoby onJoin={handleJoin}/>}
            {show==="call" && <p>Call</p>}
            {show==="ended" && <p>Ended</p>}
        </StreamTheme>
    )
}