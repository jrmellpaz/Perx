import { cn } from '@/lib/utils';

interface ConsumerLogoProps {
  logoClass?: string;
  sublogoClass?: string;
}

export function ConsumerLogo({
  logoClass = 'text-xl pb-1',
  sublogoClass = 'text-[14px]',
}: ConsumerLogoProps) {
  return (
    <div className="h-full flex items-center gap-1">
      <img
        src="/logo.svg"
        alt="Consumer Sign-up Illustration"
        className="h-full w-auto aspect-square"
      />
      <h1 className={cn('lowercase font-bold tracking-tighter', logoClass)}>
        perx
      </h1>
      <h1 className={cn('uppercase font-mono font-semibold', sublogoClass)}>
        CONSUMER
      </h1>
    </div>
  );
}
