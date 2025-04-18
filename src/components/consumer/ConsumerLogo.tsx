import { cn } from '@/lib/utils';

interface ConsumerLogoProps {
  logoClass?: string;
}

export function ConsumerLogo({
  logoClass = 'text-3xl pb-3',
}: ConsumerLogoProps) {
  return (
    <div className="flex h-full items-center gap-1">
      <img
        src="/logo.svg"
        alt="Consumer Sign-up Illustration"
        className="aspect-square h-full w-auto"
      />
      <h1 className={cn('font-black tracking-tighter lowercase', logoClass)}>
        perx
      </h1>
    </div>
  );
}
