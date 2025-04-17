'use client';

import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PerxHeader({
  title,
  className,
  style,
}: {
  title: string;
  className: string;
  style?: React.CSSProperties; // Add style prop type
}) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <header
      className={cn(
      'sticky top-0 z-10 flex w-full items-center gap-1 px-4 py-2',
      style ? '' : 'shadow-sm',
      className
    )}
      style={style}
    >
      <button
        onClick={handleBack}
        className={cn(
          'aspect-square cursor-pointer rounded-full p-3',
          style ? 'hover:bg-black' : 'hover:bg-accent'
        )}
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <h1 className="font-mono text-lg font-medium">{title}</h1>
    </header>
  );
}
