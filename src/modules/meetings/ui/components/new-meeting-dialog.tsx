import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { AgentListForDropdown } from "@/modules/agents/types";

interface MeetingNewDialogProps {
    open: boolean;
    agentList: AgentListForDropdown; // Adjust type as needed
    onOpenChange: (open: boolean) => void;
}

export const MeetingNewDialog = ({open,onOpenChange,agentList} : MeetingNewDialogProps) => {
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
            agentList={agentList} // Pass the agent list to the form
            />
        </ResponsiveDialog>   
    )
}
export default MeetingNewDialog;