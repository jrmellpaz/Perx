import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConsumerLogoProps {
  imageClass?: string;
  logoClass?: string;
  href?: string;
}

export function ConsumerLogo({
  imageClass,
  logoClass = 'text-3xl pb-3',
  href = '/explore',
}: ConsumerLogoProps) {
  return (
    <Link href={href} className="flex h-full items-center gap-1">
      <img
        src="/logo.svg"
        alt="Consumer Sign-up Illustration"
        className={cn('aspect-square h-full w-auto', imageClass)}
      />
      <h1 className={cn('font-black tracking-tighter lowercase', logoClass)}>
        perx
      </h1>
    </Link>
  );
}
