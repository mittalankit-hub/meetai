"use client";
import { useForm } from "react-hook-form";
import { AgentInsertSchema } from "../../schema"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AgentGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AgentFormProps{
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}



export const AgentForm = ({onSuccess,onCancel,initialValues}:AgentFormProps) => {


    const trpc = useTRPC()
    const queryClient = useQueryClient()


    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess:async () =>{
               await  queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
               
               if((initialValues?.id)){
                    await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({id: initialValues.id}))
                }
                
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            },

            //TODO: check if error code FORBIDDEN , redirect to /upgrade
        })
    )


    const form = useForm<z.infer<typeof AgentInsertSchema>>({
        resolver: zodResolver(AgentInsertSchema),
        defaultValues: {
                name: initialValues?.name || "",
                instructions: initialValues?.instructions || "",
            },
        })

    const isEdit = !!initialValues;
    const isPending = createAgent.isPending;


    const onSubmit = (values: z.infer<typeof AgentInsertSchema>) => {
            
        if(isEdit){
            console.log("Edit agent not implemented yet - TODO");
        }
        else {
            createAgent.mutate(values)
        }
    }
    
  

    return(
        
                    <Form{...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <GeneratedAvatar seed= {form.watch("name")} variant="botttsNeutral" className="border size-16" />
                            
                                
                                    <FormField control={form.control}
                                    name="name"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Agent Name"
                                                {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}>
                                    </FormField>
                                    

                                    
                                    <FormField control={form.control}
                                    name="instructions"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>
                                                Instructions
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="You are a helpful math assistance that can help with basic calculations."
                                                {...field}/>
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