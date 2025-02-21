'use client';

import { cn } from '@/lib/utils';
import {
  DateFieldProps,
  DateField as DateFieldRac,
  DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  DateSegmentProps,
  DateSegment as DateSegmentRac,
  DateValue as DateValueRac,
  TimeFieldProps,
  TimeField as TimeFieldRac,
  TimeValue as TimeValueRac,
  composeRenderProps,
} from 'react-aria-components';

function DateField<T extends DateValueRac>({
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <DateFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </DateFieldRac>
  );
}

function TimeField<T extends TimeValueRac>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  return (
    <TimeFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </TimeFieldRac>
  );
}

function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          'text-foreground data-focused:bg-accent data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-focused:text-foreground data-invalid:data-focused:data-placeholder:text-destructive-foreground data-invalid:data-focused:text-destructive-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive data-placeholder:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 inline rounded p-0.5 caret-transparent outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[type=literal]:px-0',
          className
        )
      )}
      {...props}
    />
  );
}

const dateInputStyle =
  'transition-all relative inline-flex h-12 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border-2 border-input focus-within:border-perx-blue bg-background px-3 py-2 text-sm data-disabled:opacity-50 data-focus-within:outline-hidden data-focus-within:has-aria-invalid:border-destructive/60';

interface DateInputProps extends DateInputPropsRac {
  className?: string;
  unstyled?: boolean;
}

function DateInput({
  className,
  unstyled = false,
  ...props
}: Omit<DateInputProps, 'children'>) {
  return (
    <DateInputRac
      className={composeRenderProps(className, (className) =>
        cn(!unstyled && dateInputStyle, className)
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  );
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle };
export type { DateInputProps };
