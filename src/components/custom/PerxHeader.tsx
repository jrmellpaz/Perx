'use client';

import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ConsumerLogo } from '../consumer/ConsumerLogo';
import { useEffect, useState } from 'react';

export default function PerxHeader({
  title,
  className,
  style,
  buttonStyle,
}: {
  title: string;
  className: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const container = document.querySelector('.scrollable-container');

    const handleScroll = () => {
      const scrollPosition = container?.scrollTop;

      if (scrollPosition !== undefined && scrollPosition > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={style}
      className={cn(
        'sticky top-0 z-10 flex w-full items-center gap-1 p-2 shadow',
        style ? (scrolled ? 'shadow-md' : 'shadow-none') : 'shadow-md',
        className
      )}
    >
      <button
        onClick={handleBack}
        style={buttonStyle}
        className="hover:bg-perx-black/10 aspect-square cursor-pointer rounded-full p-3"
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <h1 className="font-mono text-lg font-medium">{title}</h1>
    </header>
  );
}

export function PerxLogoHeader() {
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const container = document.querySelector('.scrollable-container');

    const handleScroll = () => {
      const currentScrollY = container?.scrollTop || 0;

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-12 w-full items-center justify-center bg-white shadow-md transition-all duration-500 md:hidden',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="h-8">
        <ConsumerLogo logoClass="text-xl pb-[8px]" />
      </div>
    </header>
  );
}
