import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingGetOne } from "../../types";
import { MeetingForm } from "./meeting-form";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne
}

export const MeetingEditDialog = ({open, onOpenChange, initialValues}: Props) => {
    

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit Meeting: ${initialValues.name}`}
            description="Modify the details of your meeting."
        >
            <MeetingForm 
                initialValues={initialValues}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}