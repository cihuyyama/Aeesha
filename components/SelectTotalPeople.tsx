import React, { useEffect } from "react";
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

export const frameworks = [
  {
    value: "dibawah",
    label: "Dibawah 5 Juta",
  },
  {
    value: "diantara",
    label: "5 - 10 Juta",
  },
  {
    value: "diatas",
    label: "Diatas 10 Juta",
  },
];

import { Dispatch, SetStateAction } from "react";

interface IProps {
  myVar: string;
  setMyVar: Dispatch<SetStateAction<string>>;
}

const SelectTotalPeople: React.FC<IProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleSelection = (currentValue: string) => {
    props.setMyVar(currentValue === props.myVar ? "" : currentValue);
  };

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
            ? frameworks.find((framework) => framework.value === props.myVar)
                ?.label
            : "Pilih jumlah penduduk"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  handleSelection(currentValue)
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

export default SelectTotalPeople;
