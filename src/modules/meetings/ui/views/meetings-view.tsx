"use client"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "../components/data-table-columns"
import { EmptyState } from "@/components/empty-state"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { DataPagination } from "../components/data-pagination"
import {  useRouter } from "next/navigation"


export const MeetingsView = () => {
    const[filters,setFilters] = useMeetingsFilters()
    const router = useRouter()
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }))

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data.items} onRowClick={(row)=>router.push(`/meetings/${row.id}`)} />
            <DataPagination
            page = {filters.page}
            totalPages = {data.totalPages}
            onPageChange = {(page)=>setFilters({page})}
            />
            {data.items.length == 0 && <EmptyState title="Create you first Meeting" description="Schedule a meeting to talk to an agent. Each agent will follow your instructions and can interact with participants during the call."></EmptyState>}
        </div>
    )

}
export const MeetingLoadingView = () => {
    return (
        <LoadingState title="Loading Meetings" description="This may take a few seconds...." />
    )
}

export const MeetingErrorView = () => {
    return (
        <ErrorState title="Error Loading Meetings" description="Please try again later" />
    )
}

export default MeetingsView