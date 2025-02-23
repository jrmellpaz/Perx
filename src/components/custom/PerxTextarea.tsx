import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import { useId } from 'react';

interface TextareaProps {
  label: string;
  placeholder: string;
  required?: boolean;
  autofocus?: boolean;
}

export default function PerxTextarea({
  label,
  placeholder,
  required,
  autofocus,
  ...props
}: TextareaProps) {
  const id = useId();
  return (
    <div className="group relative transition-all">
      <Label
        htmlFor={id}
        className="origin-start text-muted-foreground/70 group-focus-within:text-perx-blue peer-placeholder-shown:text-muted-foreground/70 peer-focus:text-perx-blue peer-not-placeholder-shown:text-muted-foreground/70 absolute top-0 block translate-y-2 cursor-text px-1 font-mono text-sm font-medium transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium"
      >
        <span className="bg-background ml-1 inline-flex px-1">{label}</span>
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        required={required}
        autoFocus={autofocus}
        className="placeholder:text-muted-foreground/70 text-sm placeholder:opacity-0 focus:placeholder:opacity-100"
        {...props}
      />
    </div>
  );
}
