import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col items-center justify-center">
            <EmptyState
                title="Meeting Cancelled"
                description="This meeting is cancelled."
                image="/cancelled.svg"
            />

        </div>
    );
}