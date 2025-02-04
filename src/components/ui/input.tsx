import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base file:border-0 file:bg-primary file:text-sm file:font-medium file:text-primary-foreground file:rounded-md file:p-2 file:cursor-pointer file:mr-2 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:border-sky-600 focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
