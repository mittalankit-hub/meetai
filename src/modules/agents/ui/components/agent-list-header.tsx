"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AgentNewDialog from "./new-agent-dialog";
import { useState } from "react";


export const AgentListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateAgent = () => {
        // Logic to handle agent creation
        console.log("Create Agent button clicked");
        setIsDialogOpen(true);
    };
  return (
    <>
    <AgentNewDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="flex flex-col py-4 px-8 md:px-8 gap-y-5">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">Agents</h5>
                <Button className="btn btn-primary" onClick={handleCreateAgent}>
                    <PlusIcon />New Agent
                </Button>
            </div>
        </div>
    </>
  );
}