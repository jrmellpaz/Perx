import { cn } from '@/lib/utils';

interface MerchantLogoProps {
  logoClass?: string;
  sublogoClass?: string;
}

export function MerchantLogo({
  logoClass = 'text-3xl pb-2',
  sublogoClass = 'text-2xl',
}: MerchantLogoProps) {
  return (
    <div className="flex h-full items-center">
      <img
        src="/logo.svg"
        alt="Merchant Sign-up Illustration"
        className="mr-2 aspect-square h-full w-auto"
      />
      <h1
        className={cn(
          'mr-0.5 font-black tracking-tighter lowercase',
          logoClass
        )}
      >
        perx
      </h1>
      <h1 className={cn('font-mono font-semibold uppercase', sublogoClass)}>
        MERCHANT
      </h1>
    </div>
  );
}
