import { Input } from '@/components/ui/input';
import { Ref, useId } from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface InputTextProps {
  label: string;
  type: 'text' | 'password' | 'email' | 'search' | 'file' | 'number';
  placeholder: string;
  required?: boolean;
  name?: string;
  autofocus?: boolean;
  step?: string;
  min?: string | number;
  value?: string; // Allow optional controlled input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  description?: string;
  defaultValue?: string | number; // Optional default value
}

export default function PerxInput({
  label,
  type,
  placeholder,
  required,
  name,
  autofocus,
  step,
  min,
  value,
  onChange,
  accept,
  className,
  ref,
  description,
  defaultValue,
  ...props
}: InputTextProps) {
  const id = useId();

  return (
    <>
      <div className="group relative transition-all">
        <Label
          htmlFor={id}
          className="origin-start text-muted-foreground/70 group-focus-within:text-perx-blue peer-placeholder-shown:text-muted-foreground/70 peer-focus:text-perx-blue peer-not-placeholder-shown:text-muted-foreground/70 absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:ml-1 group-focus-within:cursor-default group-focus-within:px-0 group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
        >
          <span className="bg-background ml-1 inline-flex px-1">{label}</span>
        </Label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          name={name}
          autoFocus={autofocus}
          step={step}
          min={min}
          value={value}
          onChange={onChange}
          accept={accept}
          defaultValue={defaultValue}
          className={cn(
            'placeholder:opacity-0 focus:placeholder:opacity-100',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {description && (
        <p className="text-muted-foreground/70 mt-1 text-xs">{description}</p>
      )}
    </>
  );
}
