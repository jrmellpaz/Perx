import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

interface PerxCheckboxProps {
  label: string;
  defaultChecked?: boolean;
}

export default function PerxCheckbox({ label, defaultChecked = false }: PerxCheckboxProps) {
  return (
    <label
      className={cn(
        badgeVariants({ variant: "default" }),
        "cursor-pointer hover:bg-primary/80 has-[[data-state=unchecked]]:bg-muted has-[[data-state=unchecked]]:text-muted-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70 peer-checked:bg-perx-blue"
      )}
    >
      <div className="flex items-center gap-2 p-1">
        <Checkbox
          id="badge-selectable"
          className="peer sr-only after:absolute after:inset-0"
          defaultChecked = {defaultChecked}
        />
        <Check
          size={16}  
          strokeWidth={2}         
           className="hidden peer-data-[state=checked]:block"
          aria-hidden="true"
        />
        <span className="select-none">{label}</span>
      </div>
    </label>
  );
}