import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConsumerLogoProps {
  logoClass?: string;
  href?: string;
}

export function ConsumerLogo({
  logoClass = 'text-3xl pb-3',
  href = '/explore',
}: ConsumerLogoProps) {
  return (
    <Link href={href} className="flex h-full items-center gap-1">
      <img
        src="/logo.svg"
        alt="Consumer Sign-up Illustration"
        className="aspect-square h-full w-auto"
      />
      <h1 className={cn('font-black tracking-tighter lowercase', logoClass)}>
        perx
      </h1>
    </Link>
  );
}
