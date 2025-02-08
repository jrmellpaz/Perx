import { cn } from '@/lib/utils';

interface ConsumerLogoProps {
  logoClass?: string;
}

export function ConsumerLogo({
  logoClass = 'text-xl pb-1'
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
    </div>
  );
}
