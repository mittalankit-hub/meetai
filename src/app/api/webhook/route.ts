    import { CallEndedEvent,
        CallTranscriptionReadyEvent,
        CallSessionParticipantLeftEvent,
        CallRecordingReadyEvent,
        CallSessionStartedEvent } from "@stream-io/node-sdk";
        import { StreamClient } from "@stream-io/node-sdk";
        import {and,eq,not} from "drizzle-orm"
        import { NextRequest, NextResponse } from "next/server";
        import {db} from "@/db"
        import {agents,meetings} from "@/db/schema"
        import {streamVideo} from "@/lib/stream-video"
        import { error } from "console";

        function verifySignatureWithSDK (body:string, signature:string): boolean{
            return streamVideo.verifyWebhook(body,signature)
        }
        export async function POST(req: NextRequest){
            //console.log(">>>>>>>>>>Inside webhook POST")
            const signature = req.headers.get("x-signature")
            //console.log("signature: ",signature)
            const apiKey = req.headers.get("x-api-key")
            //console.log("apiKey: ",apiKey)

            if(!signature || !apiKey){
                return NextResponse.json(
                    {error: "Missing Signature or API Key"},
                    {status:4000}
                )
            }
            const body = await req.text()
            //console.log("body: ",body)
            if(!verifySignatureWithSDK(body,signature)){
                return NextResponse.json({error:"Invalid Signature"},{status:401})
            }

            let payload:unknown;
            //console.log("Payload unkown check:",payload)
            try{
                payload = JSON.parse(body) as Record<string,unknown>;
                //console.log("Payload JSON.parse(body):",payload)
            } catch(error){
                return NextResponse.json({error:"Invaild JSON"},{status:400})
            }

            const eventType = (payload as Record<string,unknown>)?.type;
            console.log("eventType: ",eventType)

            if(eventType === "call.session_started"){
                const event = payload as CallSessionStartedEvent
                //console.log("Inside call.session_started Event: ",event)
                const meetingId = event.call.custom?.meetingId
                //console.log("Inside call.session_started meetingId: ",meetingId)

                if(!meetingId){
                    return NextResponse.json({error:"Missing meetingId"},{status:400})
                }

                const [existingMeeting] = await db.select().from(meetings).where(
                    and(
                        eq(meetings.id, meetingId),
                        not(eq(meetings.status,"completed")),
                        not(eq(meetings.status,"active")),
                        not(eq(meetings.status,"cancelled")),
                        not(eq(meetings.status,"processing"))
                    )
                )
                if(!existingMeeting){
                    console.log("Meeting not found response sent")
                    return NextResponse.json({error:"Meeting not found"},{status:404})
                }

                await db.update(meetings).set({
                    status:"active",
                    startedAt: new Date(),
                }).where(eq(meetings.id,existingMeeting.id))

                const [existingAgent] = await db.select().from(agents).where(eq(agents.id,existingMeeting.agentId))

                if(!existingAgent){
                    return NextResponse.json({error:"Agent not found"},{status:404})
                }
                const call = streamVideo.video.call("default",meetingId)
                //console.log("Inside call.session_started Call: ",call)

                const realtimeClient = await streamVideo.video.connectOpenAi({
                    call,
                    openAiApiKey: process.env.OPENAI_API_KEY!,
                    agentUserId: existingAgent.id,
                    
                })
                realtimeClient.updateSession({
                    instructions:existingAgent.instructions
                })
            }else if(eventType === "call.session_participant_left"){
                const event = payload as CallSessionParticipantLeftEvent
                //console.log("Inside call.session_participant_left Event: ",event)
                const meetingId = event.call_cid.split(":")[1] //call_cid is formatted as "type:id"
                if(!meetingId){
                    return NextResponse.json({error:"Missing meetingID"},{status:400})
                }
                const call = streamVideo.video.call("default",meetingId)
                //console.log("Inside call.session_participant_left Call: ",call)
                await call.end()
            }

            return NextResponse.json({status:"ok"})
        }