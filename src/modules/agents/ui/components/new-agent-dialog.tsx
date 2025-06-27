import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface AgentNewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AgentNewDialog = ({open,onOpenChange} : AgentNewDialogProps) => {
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="New Agent"
            description="Create a new agent to assist with your tasks."
        >
            <AgentForm 
            onSuccess={ () => onOpenChange(false) }
            onCancel={() => onOpenChange(false)}    
            
            
            />
        </ResponsiveDialog>   
    )
}
export default AgentNewDialog;