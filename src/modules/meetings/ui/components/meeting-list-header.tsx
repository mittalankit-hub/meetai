"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { MeetingNewDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { DEFAULT_PAGE_NUM } from "@/constants";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { MeetingsSearchFilters } from "./meetings-search-filters";
import { meetingStatus } from "@/db/schema";


export const MeetingListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters,setFilters] = useMeetingsFilters()

    const isAnyFilterModified = !!filters.search || (filters.status !== null)


    const onClearFilters = ()=>{
        setFilters({
            search:"",
            page: DEFAULT_PAGE_NUM,
            status: null,
        })
    }

    const handleCreateMeeting = () => {
        // Logic to handle agent creation

        setIsDialogOpen(true);
    };
  return (
    <>
    <MeetingNewDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="flex flex-col py-4 px-8 md:px-8 gap-y-5">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button className="btn btn-primary" onClick={handleCreateMeeting}>
                    <PlusIcon />New Meeting
                </Button>
            </div>
        
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilters status={meetingStatus.enumValues}/>
                {isAnyFilterModified && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <XCircleIcon/>
                        Clear
                    </Button>
                )}
            </div>
        </div>
    </>
  );
}