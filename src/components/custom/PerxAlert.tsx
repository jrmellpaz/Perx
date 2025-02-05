import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'border-border flex gap-0.5 rounded-lg border px-4 py-3',
  {
    variants: {
      variant: {
        default: 'border-perx-blue/50',
        warning: 'border-amber-500/50',
        success: 'border-emerald-500/50',
        error: 'border-red-500/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface PerxAlertProps {
  heading: string;
  message: string;
  variant: 'default' | 'warning' | 'success' | 'error';
}

export default function PerxAlert({
  heading,
  message,
  variant,
}: PerxAlertProps) {
  return (
    <div className="border-border flex gap-0.5 rounded-lg border px-4 py-3">
      {variant === 'default' ? (
        <Info
          className="me-3 mt-0.5 inline-flex text-blue-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : variant === 'warning' ? (
        <TriangleAlert
          className="hrink-0 mt-0.5 text-amber-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : variant === 'error' ? (
        <CircleAlert
          className="spa me-3 mt-0.5 inline-flex text-red-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : variant === 'success' ? (
        <CircleCheck
          className="me-3 mt-0.5 inline-flex text-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
      <div className="grow space-y-1">
        <h1 className="text-sm font-medium">{heading}</h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
