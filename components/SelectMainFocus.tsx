import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Check, ChevronsUpDown } from "lucide-react";

export const framework = [
  {
    value: "governance",
    label: "Smart Governance",
  },
  {
    value: "economy",
    label: "Smart Economy",
  },
  {
    value: "living",
    label: "Smart Living",
  },
  {
    value: "mobility",
    label: "Smart Mobility",
  },
  {
    value: "environment",
    label: "Smart Environment",
  },
];

interface IProps {
  myVar: string;
  setMyVar: Dispatch<SetStateAction<string>>;
}

const SelectMainFocus: React.FC<IProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={!props.myVar ? setOpen : () => {}}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-lime-400"
        >
          {props.myVar
            ? framework.find((framework) => framework.value === props.myVar)
                ?.label
            : "Pilih fokus utama"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {framework.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  props.setMyVar(
                    currentValue === props.myVar ? "" : currentValue
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.myVar === framework.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMainFocus;
