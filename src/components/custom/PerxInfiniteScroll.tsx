'use client';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function LoadMore() {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      alert('Load more items!');
    }
  }, [inView]);

  return (
    <section className="flex w-full items-center justify-center py-4">
      <div ref={ref}>
        <LoaderCircle className="animate-spin" />
      </div>
    </section>
  );
}
