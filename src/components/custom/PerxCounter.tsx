'use client';

import { cn, getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { MinusIcon, PlusIcon } from 'lucide-react';
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from 'react-aria-components';

interface PerxCounterProps {
  max: number;
  label?: string;
  className?: string;
  accentColor: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
  value?: number;
}

export default function PerxCounter({
  max,
  label,
  className,
  accentColor,
  onChange,
  disabled,
  value,
}: PerxCounterProps) {
  return (
    <NumberField
      defaultValue={1}
      value={value}
      minValue={1}
      maxValue={max}
      onChange={(value) => {
        let safeValue = value;
        if (!value || value < 1) {
          safeValue = 1;
        }
        if (onChange) {
          onChange(safeValue);
        }
      }}
      isDisabled={disabled}
    >
      <div className="flex items-center ring-0 *:not-first:mt-2">
        {label && (
          <Label className="text-foreground text-sm font-medium">{label}</Label>
        )}
        <Group
          className={cn(
            'relative inline-flex h-9 w-full items-center overflow-hidden rounded-md text-sm whitespace-nowrap ring-0 transition-all outline-none data-disabled:opacity-50',
            className
          )}
        >
          <Button
            slot="decrement"
            className="bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] cursor-pointer items-center justify-center rounded-s-md text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: getPrimaryAccentColor(accentColor) }}
          >
            <MinusIcon
              size={16}
              aria-hidden="true"
              style={{ color: getAccentColor(accentColor) }}
            />
          </Button>
          <Input className="text-foreground w-16 bg-white/50 px-3 py-2 text-center tabular-nums transition-all focus:outline-none" />
          <Button
            slot="increment"
            className="bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] cursor-pointer items-center justify-center rounded-e-md text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: getPrimaryAccentColor(accentColor) }}
          >
            <PlusIcon
              size={16}
              aria-hidden="true"
              style={{ color: getAccentColor(accentColor) }}
            />
          </Button>
        </Group>
      </div>
    </NumberField>
  );
}
