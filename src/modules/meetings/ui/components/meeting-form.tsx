"use client";
import { useForm } from "react-hook-form";
import { MeetingInsertSchema } from "../../schema"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MeetingGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useRouter } from "next/navigation";
import AgentNewDialog from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps{
    onSuccess?: (id?:string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}



export const MeetingForm = ({onSuccess,onCancel,initialValues}:MeetingFormProps) => {


    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const [agentSearch,setAgentSearch] = useState("");
    const router = useRouter()
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search:agentSearch // Fetch a reasonable number of agents for the dropdown
        }),
    )


    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess:async () =>{
               await  queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
               
               //TODO: Invalidate free tier usage 
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            },

            //TODO: check if error code FORBIDDEN , redirect to /upgrade
        })
    )

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess:async () =>{
               await  queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
               
               if((initialValues?.id)){
                    await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({id: initialValues.id}))
                }
                
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            },

            //TODO: check if error code FORBIDDEN , redirect to /upgrade
        })
    )

    const form = useForm<z.infer<typeof MeetingInsertSchema>>({
        resolver: zodResolver(MeetingInsertSchema),
        defaultValues: {
                name: initialValues?.name || "",
                agentId: initialValues?.agentId || "",
            },
        })

    const isEdit = !!initialValues;
    const isPending = createMeeting.isPending || updateMeeting.isPending;


    const onSubmit = (values: z.infer<typeof MeetingInsertSchema>) => {
        console.log("Inside Meeting Form values: ", values)
            
        if(isEdit){
            updateMeeting.mutate({...values , id: initialValues.id })
        }
        else {
            createMeeting.mutate(values)
            router.push(`/meetings/${values.agentId}`)
        }
    }
    
  

    return(
        <>
                    <AgentNewDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
                    <Form{...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                
                      
                                <FormField control={form.control}
                                    name="name"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Meeting Name"
                                                {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}>
                                    </FormField>
                            
                                    <FormField control={form.control}
                                        name="agentId"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>
                                                    Agent
                                                </FormLabel>
                                                <FormControl>
                                                    <CommandSelect
                                                        options={(agents.data?.items ?? []).map((agent) => ({
                                                            id: agent.id,
                                                            value: agent.id,
                                                            children: (
                                                                <div className="flex items-center gap-x-2">
                                                                    <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-6"/>
                                                                    <span>{agent.name}</span>
                                                                </div>
                                                            )
                                                        }))}
                                                        onSelect={field.onChange}
                                                        onSearch={setAgentSearch}
                                                        value={field.value}
                                                        placeholder="Select an agent"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}>
                                    </FormField>
                                    <FormDescription>
                                        Not Found what you&apos;re looking for? {" "}
                                        <button type="button" className="text-primary hover:underline" onClick={setOpenNewAgentDialog}>Create new Agent</button> 
                                    </FormDescription>
                              
                                
                       
                                <div className="flex justify-between gap-x-2">
                                    {onCancel && 
                                    (
                                    <Button variant="ghost" disabled= {isPending} type="button" onClick={() => onCancel()}>
                                        Cancel
                                    </Button>)}
                                    <Button type="submit" disabled={isPending} >
                                        {isEdit ? "Update" : "Create"}</Button>
                                </div>
                                
                                
                            
                        </form>
                    </Form>
        </>
    )
}