import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { JSX, useState } from "react";



export const useConfirm = (
    title: string,
    description: string,
):[()=>JSX.Element,()=>Promise<unknown>] => {
    
    
    const [promise, setPromise] = useState<{resolve: (value:boolean)=>void;}| null>(null)
    

    const confirm =()=>{
                        return new Promise((resolve)=> 
                            {
                                console.log(" Resolve Arguement :", resolve);
                                setPromise({resolve})
                                console.log("Promise set with resolve",promise);
                            }
                                            )
            
                        }

    const handleClose = ()=>{
        setPromise(null)
    }

    const handleConfirm = ()=>{
        promise?.resolve(true)
        handleClose()
    }

    const handleCancel =()=>{
        promise?.resolve(false)
        handleClose()
    }

    const ConfirmationDialog = () => {
            return(
            <ResponsiveDialog open={promise!==null} onOpenChange={handleClose} title={title} description={description}>
                <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                    <Button onClick={handleCancel} variant="outline" className="w-full lg:w-auto">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="w-full lg:w-auto">
                        Confirm
                    </Button>
                </div>
            </ResponsiveDialog>
        );
    }
    
        
    return [ConfirmationDialog, confirm];

}