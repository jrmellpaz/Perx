'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import PerxCheckbox from './PerxCheckbox';
import RangeSlider from './PerxSlider'; 
import { couponCategories } from '@/lib/couponSchema';

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
      <CouponFilterForm />
    </header>
  );
}

export function CouponFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  // const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 10000),
  ]);
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

    // minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice');
    // maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice');
    params.set('minPrice', String(priceRange[0]));
    params.set('maxPrice', String(priceRange[1]));

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
      <div className="filter-details flex flex-col gap-2 px-2 md:px-4">
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex flex-wrap gap-2">
              <div className="col-span-2 flex flex-col gap-1">
                <span className="ml-1 font-mono text-xs font-medium">Price</span>
                <RangeSlider
                  min={0}
                  max={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
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
            </div>
            <div className="col-span-3 flex flex-col gap-1">
              <span className="ml-1 font-mono text-xs font-medium">Tags</span>
              <div className="flex flex-wrap gap-2">
                <PerxCheckbox
                  label="Limited-time offers"
                  checked={allowLimitedPurchase}
                  onCheckedChange={(checked) =>
                    setAllowLimitedPurchase(checked)
                  }
                  className="text-xs"
                />
                <PerxCheckbox
                  label="Allows repeat purchase"
                  checked={allowRepeatPurchase}
                  onCheckedChange={(checked) => setAllowRepeatPurchase(checked)}
                  className="text-xs"
                />
                <PerxCheckbox
                  label="Purchasable with Points"
                  checked={allowPointsPurchase}
                  onCheckedChange={(checked) => setAllowPointsPurchase(checked)}
                  className="text-xs"
                />
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
      </div>
    </div>
  );
}
