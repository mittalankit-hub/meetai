import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col items-center justify-center">
            <EmptyState
                title="Meeting Completed"
                description="This meeting is completed and is current being processed. A summary will appear here once processing is done."
                image="/processing.svg"
            />

        </div>
    );
}