"use client";
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnumValues } from "zod";
import {meetingStatus} from "@/db/schema";


interface MeetingsSearchFiltersProps {
    status: EnumValues
}

export const MeetingsSearchFilters = ({status}:MeetingsSearchFiltersProps) => {

    const [filters,setFilters] = useMeetingsFilters()

    return(


            <div className="flex gap-x-2"> 
                <div className="relative">
                    <Input
                        placeholder="Filter by name"
                        className="h-9 bg-white w-[200px] pl-7"
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                    />
                    <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foregorund"/>
                </div>

                <Select
                onValueChange={(value) => setFilters({ status: value as "upcoming" | "active" | "completed" | "processing" | "cancelled" | null | undefined })}
                >
                    <SelectTrigger className="h-9 w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                        <SelectContent>
                            {status?.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>))}
                        </SelectContent>
                </Select>

            </div>
        
    )
}
