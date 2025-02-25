import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckIcon } from 'lucide-react';
import { useId } from 'react';

interface PerxCheckboxProps {
  label: string;
  defaultChecked: boolean;
}

export default function PerxCheckbox({
  label,
  defaultChecked,
  ...props
}: PerxCheckboxProps) {
  const id = useId();
  return (
    <Badge className="has-data-[state=unchecked]:bg-muted has-data-[state=checked]:bg-perx-blue has-data-[state=unchecked]:text-muted-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex gap-2 px-4 py-1 text-sm transition-all outline-none has-focus-visible:ring-[3px]">
      <Checkbox
        id={id}
        className="peer sr-only after:absolute after:inset-0"
        defaultChecked={defaultChecked}
        {...props}
      />
      <CheckIcon
        size={16}
        strokeWidth={3}
        className="hidden peer-data-[state=checked]:block"
        aria-hidden="true"
      />
      <label
        htmlFor={id}
        className="cursor-pointer select-none after:absolute after:inset-0"
      >
        {label}
      </label>
    </Badge>
  );
}
