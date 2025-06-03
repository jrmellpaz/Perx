import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useId, useState } from 'react';

export default function PerxSelect({
  label,
  description,
  options,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  options: {
    id: string;
    title: string;
    icon: string;
  }[];
  value: string; // Controlled value
  onValueChange: (value: string) => void; // Controlled onChange handler
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="group relative transition-all *:not-first:mt-2">
      <Label
        htmlFor={id}
        className={cn(
          'bg-background text-muted-foreground/70 group-focus-within:text-perx-blue pointer-events-none absolute z-50 ml-2 px-1 font-mono text-xs font-medium transition-all',
          open && 'text-perx-blue'
        )}
      >
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        defaultValue="1"
        onOpenChange={setOpen}
        open={open}
      >
        <SelectTrigger
          id={id}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-perx-blue focus-within:border-perx-blue data-[state=open]:border-perx-blue relative flex h-12 w-full shrink-0 items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            {options.map((option, index) => {
              const { id, title, icon } = option;
              return (
                <SelectItem key={index} value={id}>
                  <img className="size-5" src={icon || undefined} alt={title} />
                  <p>{`${title} and up`}</p>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
        <p className="text-muted-foreground/70 text-xs">{description}</p>
      </Select>
    </div>
  );
}
