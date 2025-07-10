"use client";
import { CommandSelect } from "@/components/command-select";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";




export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    const trpc = useTRPC()
    const [agentSearch,setAgentSearch] = useState("");
     const agents = useQuery(
            trpc.agents.getMany.queryOptions({
                pageSize: 100,
                search:agentSearch // Fetch a reasonable number of agents for the dropdown
            }),
        )
    
    return (
        <CommandSelect
        placeholder="Agent"
        className="h-9"
        options={(agents.data?.items ?? []).map((agent) => ({
                                                                    id: agent.id,
                                                                    value: agent.id,
                                                                    children: (
                                                                        <div className="flex items-center gap-x-2">
                                                                            <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-4"/>
                                                                            <span>{agent.name}</span>
                                                                        </div>
                                                                    )
                                                                }))}
        onSelect={(value) => setFilters({ agentId: value })}
        onSearch={setAgentSearch}
        value={filters.agentId}
        />
    );
}