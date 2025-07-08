import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentGetOne } from "../../types";
import { AgentForm } from "./agent-form";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentGetOne
}

export const AgentEditDialog = ({open, onOpenChange, initialValues}: Props) => {
    

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit Agent: ${initialValues.name}`}
            description="Modify the details of your agent."
        >
            <AgentForm 
                initialValues={initialValues}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}