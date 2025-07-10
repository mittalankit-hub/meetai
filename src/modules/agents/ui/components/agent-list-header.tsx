"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import AgentNewDialog from "./new-agent-dialog";
import { useState } from "react";
import {useAgentsFilters} from "@/modules/agents/hooks/use-agents-filters"
import { AgentsSearchFilters } from "./agents-search-filters";
import { DEFAULT_PAGE_NUM } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


export const AgentListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters,setFilters] = useAgentsFilters()
    const isAnyFilterModified = !!filters.search

    const onClearFilters = ()=>{
        setFilters({
            search:"",
            page: DEFAULT_PAGE_NUM,
        })
    }

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
        <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <AgentsSearchFilters/>
                {isAnyFilterModified && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <XCircleIcon/>
                        Clear
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    </>
  );
}