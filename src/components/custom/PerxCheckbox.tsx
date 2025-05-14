import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { useId } from 'react';

interface PerxCheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export default function PerxCheckbox({
  label,
  checked,
  onCheckedChange,
  className,
}: PerxCheckboxProps) {
  const id = useId();

  return (
    <Badge
      className={cn(
        'hover:bg-perx-blue/10 relative flex gap-2 px-4 py-1 text-sm shadow-none transition-all outline-none',
        checked
          ? 'bg-perx-blue hover:bg-perx-blue/90 text-white'
          : 'bg-muted text-muted-foreground',
        className
      )}
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
