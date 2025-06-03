'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface LoadMoreProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

export function LoadMore({ onLoadMore, isLoading }: LoadMoreProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isLoading) {
      onLoadMore();
    }
  }, [inView]);

  return (
    <section ref={ref} className="flex h-max w-full flex-col rounded-md border">
      <div className="bg-muted aspect-video w-full animate-pulse rounded-md"></div>
      <div className="flex flex-col gap-1.5 px-2 py-2">
        <div className="bg-muted h-6 w-3/4 animate-pulse rounded-md"></div>
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded-md"></div>
      </div>
    </section>
  );
}

export function TransactionLoading({ onLoadMore, isLoading }: LoadMoreProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isLoading) {
      onLoadMore();
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="mt-2 mb-6 flex w-full max-w-[800px] flex-col gap-2"
    >
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </div>
  );
}
