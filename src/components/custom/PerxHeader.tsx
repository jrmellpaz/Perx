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
  children,
}: {
  title: string;
  className: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const container = document.querySelector('.view-container');

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
        'sticky top-0 z-10 flex h-15.25 w-full shrink-0 items-center gap-1 px-2',
        scrolled ? 'shadow-md' : 'shadow-none',
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
      {children}
    </header>
  );
}

export function PerxLogoHeader({ scrollContainerSelector = '.view-container' }: { scrollContainerSelector?: string }) {
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const container = document.querySelector(scrollContainerSelector);
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerSelector, lastScrollY]);

  return (
    <header
      className={cn(
        'w-full flex h-12 items-center justify-center bg-white shadow-md transition-transform duration-500 ease-in-out md:hidden',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{ position: 'relative', top: 0, zIndex: 40 }}
    >
      <div className="h-8">
        <ConsumerLogo logoClass="text-xl pb-[8px]" />
      </div>
    </header>
  );
}
