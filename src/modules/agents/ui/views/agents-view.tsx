"use client"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DataTable } from "../components/data-table"
import { columns } from "../components/data-table-columns"
import { EmptyState } from "@/components/empty-state"


export const AgentView = () => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({}))

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data.items} />
            {data.items.length == 0 && <EmptyState title="Create you first agent" description="Create an agent to join your meeting. Each agent will follow your instructions and can interact with participants during the call."></EmptyState>}
        </div>
    )

}
export const AgentLoadingView = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take a few seconds...." />
    )
}

export const AgentErrorView = () => {
    return (
        <ErrorState title="Error Loading Agents" description="Please try again later" />
    )
}

export default AgentView