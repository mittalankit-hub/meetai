import { EmptyState } from "@/components/empty-state";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon } from "lucide-react";

interface UpcomingStateProps {
    meetingId: string;
}

export const UpcomingState = ({meetingId}:UpcomingStateProps) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col items-center justify-center">
            <EmptyState
                title="Not Yet Started"
                description="Once you start this meeting, a summary will appear here."
                image="/upcoming.svg"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Start Meeting 
                    </Link>
                </Button>
            </div>
        </div>
    );
}