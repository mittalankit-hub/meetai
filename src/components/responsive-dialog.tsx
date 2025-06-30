import { Dialog,DialogContent,DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Drawer,DrawerContent,DrawerHeader,DrawerTitle,DrawerDescription } from "./ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ResponsiveDialog = ({title,description,children, open, onOpenChange}:ResponsiveDialogProps)=>{

    const isMobile = useIsMobile();
    
    //console.log("Open: ",open)
    if (isMobile) {
        return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">{children}</div>
            </DrawerContent>
        </Drawer>
        );
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}