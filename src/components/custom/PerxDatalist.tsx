import { useId } from 'react';
import { Label } from '../ui/label';

export function PerxDatalist({
  options,
  label,
  ...props
}: {
  options: { value: string; label: string }[];
  label: string;
}) {
  const id = useId();

  return (
    <div className="group relative transition-all">
      <Label
        htmlFor="perx-datalist"
        className="origin-start text-muted-foreground/70 group-focus-within:text-perx-blue peer-placeholder-shown:text-muted-foreground/70 peer-focus:text-perx-blue peer-not-placeholder-shown:text-muted-foreground/70 absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:ml-1 group-focus-within:cursor-default group-focus-within:px-0 group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
      >
        <span className="bg-background ml-1 inline-flex px-1">{label}</span>
      </Label>
      <input
        list={id}
        name="perx-datalist"
        className="border-input border-2border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-perx-blue flex h-12 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <datalist id={id}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </div>
  );
}
