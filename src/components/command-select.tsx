import { ReactNode,useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog
} from "@/components/ui/command";


interface CommandSelectProps {
    options: Array<{ 
        id: string; 
        value: string; 
        children: ReactNode }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value?: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
    }

export const CommandSelect = ({options,onSelect,onSearch,value,placeholder="Select an Option",className}:CommandSelectProps)=>{
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    const handleOpenChange = (value:boolean)=>{
        setOpen(value);
        onSearch?.("");

    }

    return (
        <>
        <Button onClick={()=>{setOpen(true)}} type="button" variant="outline" className={cn("h-9 justify-between font-normal px-2",!selectedOption && "text-muted-foreground", className)}>
            <div>
                {selectedOption?.children ?? placeholder}
            </div>
            <ChevronsUpDownIcon />
        </Button>
        <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}>
            <CommandInput placeholder="Search..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty>
                        <span>
                            No options found.
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={()=>{
                                onSelect(option.value);
                                setOpen(false);
                                onSearch?.("");
                            }}>
                                {option.children}
                        </CommandItem>
                        ))
                }
                </CommandList>
            </CommandResponsiveDialog>
        </>)
}