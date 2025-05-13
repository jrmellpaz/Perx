'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PerxSearchbar({
  children,
  query,
}: {
  children: React.ReactNode;
  query?: string;
}) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const container = document.querySelector('.view-container');
    const handleScroll = () => {
      const scrollPosition = container?.scrollTop;

      if (scrollPosition !== undefined && scrollPosition > 16) {
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
      className={cn(
        'sticky top-2 z-50 flex w-full max-w-[800px] flex-col items-center justify-between gap-1.5 rounded-t-3xl rounded-b-md bg-white transition-all',
        scrolled ? 'shadow-md' : 'shadow-none'
      )}
    >
      {children}
      {query && <CouponFilterForm />}
    </header>
  );
}

export function CouponFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [allowLimitedPurchase, setAllowLimitedPurchase] = useState(
    searchParams.get('allowLimitedPurchase') === 'true'
  );
  const [allowRepeatPurchase, setAllowRepeatPurchase] = useState(
    searchParams.get('allowRepeatPurchase') === 'true'
  );
  const [allowPointsPurchase, setAllowPointsPurchase] = useState(
    searchParams.get('allowPointsPurchase') === 'true'
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice');
    maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice');
    allowLimitedPurchase
      ? params.set('allowLimitedPurchase', 'true')
      : params.delete('allowLimitedPurchase');
    allowRepeatPurchase
      ? params.set('allowRepeatPurchase', 'true')
      : params.delete('allowRepeatPurchase');
    allowPointsPurchase
      ? params.set('allowPointsPurchase', 'true')
      : params.delete('allowPointsPurchase');
    endDate ? params.set('endDate', endDate) : params.delete('endDate');

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col">
      <details className="peer filter-details flex flex-col gap-2 px-2 md:px-4">
        <summary className="hover:bg-perx-blue/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-md p-2 font-mono text-xs transition-all">
          <ListFilter size={16} /> Filters
        </summary>
        <div className="flex flex-col gap-1 pb-4">
          <div className="grid w-full grid-cols-3 items-center gap-1 gap-y-1.5 lg:grid-cols-6">
            <div className="col-span-2 flex flex-col gap-1">
              <span className="ml-1 font-mono text-xs font-medium">Price</span>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="ml-1 font-mono text-xs font-medium">
                End date
              </span>
              <input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
              />
            </div>
            <div className="col-span-3 flex flex-col gap-1">
              <span className="ml-1 font-mono text-xs font-medium">Tags</span>
              <div className="grid grid-cols-3 gap-1">
                <label className="ml-1 flex h-8 cursor-pointer items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={allowLimitedPurchase}
                    onChange={(e) => setAllowLimitedPurchase(e.target.checked)}
                    className="accent-perx-blue"
                  />
                  Limited dates
                </label>
                <label className="flex cursor-pointer items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={allowRepeatPurchase}
                    onChange={(e) => setAllowRepeatPurchase(e.target.checked)}
                    className="accent-perx-blue"
                  />
                  Allows repeat
                </label>
                <label className="flex cursor-pointer items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={allowPointsPurchase}
                    onChange={(e) => setAllowPointsPurchase(e.target.checked)}
                    className="accent-perx-blue"
                  />
                  Buy with points
                </label>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-fit w-fit cursor-pointer self-end rounded px-2 py-1.5 text-xs"
            onClick={applyFilters}
          >
            Apply filters
          </Button>
        </div>
      </details>
    </div>
  );
}
