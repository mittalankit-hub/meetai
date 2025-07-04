import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentGetOne } from "../../types";
import { AgentForm } from "./agent-form";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: AgentGetOne
}

export const AgentEditDialog = ({open, onOpenChange, data}: Props) => {
    

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit Agent: ${data.name}`}
            description="Modify the details of your agent."
        >
            <AgentForm 
                initialValues={data}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}