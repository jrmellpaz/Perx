import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useId } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a `cn` utility for class concatenation

type Colors = {
  name: string;
  primary: string;
  secondary: string;
};

export default function PerxColors({
  colors,
  label,
  value,
  onChange,
}: {
  colors: Colors[];
  label: string;
  value: string; // Controlled value from react-hook-form
  onChange: (value: string) => void; // onChange handler from react-hook-form
}) {
  const id = useId();

  return (
    <fieldset className="space-y-2">
      <legend className="text-foreground font-mono text-sm leading-none font-medium">
        {label}
      </legend>
      <RadioGroup
        className="flex gap-1.5"
        value={value} // Controlled value
        onValueChange={onChange} // Controlled onChange handler
      >
        {colors.map((color, index) => {
          const primary = color.primary;

          return (
            <RadioGroupItem
              key={index}
              value={color.primary}
              id={`${id}-${color.primary}`}
              aria-label={color.name}
              className={cn(
                'size-12 cursor-pointer shadow-none',
                primary === 'perx-blue'
                  ? 'border-perx-blue bg-perx-blue data-[state=checked]:border-perx-blue data-[state=checked]:bg-perx-blue'
                  : primary === 'perx-canopy'
                    ? 'border-perx-canopy bg-perx-canopy data-[state=checked]:border-perx-canopy data-[state=checked]:bg-perx-canopy'
                    : primary === 'perx-gold'
                      ? 'border-perx-gold bg-perx-gold data-[state=checked]:border-perx-gold data-[state=checked]:bg-perx-gold'
                      : primary === 'perx-rust'
                        ? 'border-perx-rust bg-perx-rust data-[state=checked]:border-perx-rust data-[state=checked]:bg-perx-rust'
                        : primary === 'perx-azalea'
                          ? 'border-perx-azalea bg-perx-azalea data-[state=checked]:border-perx-azalea data-[state=checked]:bg-perx-azalea'
                          : 'border-perx-navy bg-perx-navy data-[state=checked]:border-perx-navy data-[state=checked]:bg-perx-navy'
              )}
            />
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
