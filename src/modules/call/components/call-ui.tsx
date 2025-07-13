import { useState } from "react";
import {StreamTheme, useCall} from "@stream-io/video-react-sdk"
import { CallLoby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName:string;
}

export const CallUI = ({meetingName}:Props)=>{

    const call = useCall()
    const [show,setShow] = useState<"lobby" | "call" | "ended">("lobby")

    const handleJoin = async ()=>{
        if(!call) return;
        await call.join()
        const state = call?.state.callingState
        console.log("Handle Join: ",state)
        setShow("call")
    }

    const handleLeave = async ()=>{
        if(!call) return;

        const state = call?.state.callingState
        console.log("Handle Leave",state)
        // if(state === "left"){
        //     setShow("ended")
        //     return
        // }
        try{
        await call.leave()
        setShow("ended")
        }catch(error){
            console.log("Error while leaving the call:",error)
        } finally{
            setShow("ended")
        }
    }

    return(
        <StreamTheme className="h-full">
            {show==="lobby" && <CallLoby onJoin={handleJoin}/>}
            {show==="call" && <CallActive meetingName={meetingName} onLeave={handleLeave}/>}
            {show==="ended" && <CallEnded />}
        </StreamTheme>
    )
}