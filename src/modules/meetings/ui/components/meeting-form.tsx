"use client";
import { useForm } from "react-hook-form";
import { MeetingInsertSchema } from "../../schema"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MeetingGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentListForDropdown } from "@/modules/agents/types";

interface MeetingFormProps{
    onSuccess?: (id?:string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
    agentList: AgentListForDropdown;
}



export const MeetingForm = ({onSuccess,onCancel,initialValues,agentList}:MeetingFormProps) => {


    const trpc = useTRPC()
    const queryClient = useQueryClient()

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
        }
    }
    
  

    return(
        
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select an agent" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {agentList?.map((agent) => (
                                                            <SelectItem key={agent.id} value={agent.id}>
                                                                {agent.name}
                                                            </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}>
                                    </FormField>
                              
                                
                       
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
        
    )
}