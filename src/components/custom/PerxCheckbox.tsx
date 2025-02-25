import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckIcon } from 'lucide-react';
import { useId } from 'react';

interface PerxCheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function PerxCheckbox({ label, checked, onCheckedChange }: PerxCheckboxProps) {
  const id = useId();

  return (
    <Badge
      className={`relative flex gap-2 px-4 py-1 text-sm transition-all shadow-none outline-none hover:bg-perx-blue/10 
        ${checked ? 'bg-perx-blue text-white hover:bg-perx-blue/90' : 'bg-muted text-muted-foreground'}`}
    >
      <Checkbox
        id={id}
        className="peer sr-only after:absolute after:inset-0"
        checked={checked}
        onCheckedChange={onCheckedChange} // Use this instead of onChange
      />
      <CheckIcon
        size={16}
        strokeWidth={3}
        className={`transition-opacity ${checked ? 'block' : 'hidden'}`}
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
