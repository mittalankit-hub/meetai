import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";


interface MeetingNewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MeetingNewDialog = ({open,onOpenChange,} : MeetingNewDialogProps) => {
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="New Meeting"
            description="Create a new meeting to talk to an agent."
        >
            <MeetingForm 
            onSuccess={ () => onOpenChange(false) }
            onCancel={() => onOpenChange(false)}    
            />
        </ResponsiveDialog>   
    )
}
export default MeetingNewDialog;