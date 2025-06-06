'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import PerxCheckbox from './PerxCheckbox';
import RangeSlider from './PerxSlider';
import { ListFilter } from 'lucide-react';
import { getHighestOriginalPrice } from '@/actions/purchase';

export function PerxSearchbar({
  children,
  query,
}: {
  children: React.ReactNode;
  query?: string;
}) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const container = document.querySelector('.scrollable-container');
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

  const [logoHeaderHidden, setLogoHeaderHidden] = useState(false);

  useEffect(() => {
    const handler = (e: any) => setLogoHeaderHidden(e.detail.hidden);
    window.addEventListener('perx-logo-header-visibility', handler);
    return () =>
      window.removeEventListener('perx-logo-header-visibility', handler);
  }, []);

  return (
    <header
      className={cn(
        'sticky z-50 flex w-full max-w-[800px] flex-col items-center justify-between gap-1.5 bg-white will-change-transform md:top-2',
        query ? 'rounded-t-3xl rounded-b-md' : 'rounded-full',
        scrolled ? 'shadow-md' : 'shadow-none',
        logoHeaderHidden
          ? 'perx-searchbar-top-hidden'
          : 'perx-searchbar-top-visible',
        'perx-searchbar-transition',
        'md:perx-searchbar-no-transition'
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
  const [priceState, setPriceState] = useState<{
    maxPrice: number;
    priceRange: [number, number];
  }>({ maxPrice: 0, priceRange: [0, 0] });

  useEffect(() => {
    const loadMaxPrice = async () => {
      const maxPrice = await getHighestOriginalPrice();
      setPriceState({
        maxPrice,
        priceRange: [
          Number(searchParams.get('minPrice') || 0),
          Number(searchParams.get('maxPrice') || maxPrice),
        ],
      });
    };
    loadMaxPrice();
  }, [searchParams]);

  // const [allowLimitedPurchase, setAllowLimitedPurchase] = useState(
  //   searchParams.get('allowLimitedPurchase') === 'true'
  // );
  const [allowRepeatPurchase, setAllowRepeatPurchase] = useState(
    searchParams.get('allowRepeatPurchase') === 'true'
  );
  const [allowPointsPurchase, setAllowPointsPurchase] = useState(
    searchParams.get('allowPointsPurchase') === 'true'
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', String(priceState.priceRange[0]));
    params.set('maxPrice', String(priceState.priceRange[1]));

    // allowLimitedPurchase
    //   ? params.set('allowLimitedPurchase', 'true')
    //   : params.delete('allowLimitedPurchase');
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
        <div className="filter-details flex flex-col gap-2 px-2 md:px-4">
          <div className="flex flex-col gap-2 pb-4">
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex flex-wrap gap-2">
                <div className="col-span-2 flex flex-col gap-3">
                  <span className="ml-1 font-mono text-xs font-medium">
                    Price
                  </span>
                  <RangeSlider
                    min={0}
                    max={priceState.maxPrice}
                    value={priceState.priceRange}
                    onValueChange={(range) =>
                      setPriceState((prev) => ({ ...prev, priceRange: range }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
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
                  {/* <PerxCheckbox
                    label="Limited-time offers"
                    checked={allowLimitedPurchase}
                    onCheckedChange={(checked) =>
                      setAllowLimitedPurchase(checked)
                    }
                    className="text-xs"
                  /> */}
                  <PerxCheckbox
                    label="Allows repeat purchase"
                    checked={allowRepeatPurchase}
                    onCheckedChange={(checked) =>
                      setAllowRepeatPurchase(checked)
                    }
                    className="text-xs"
                  />
                  <PerxCheckbox
                    label="Purchasable with Points"
                    checked={allowPointsPurchase}
                    onCheckedChange={(checked) =>
                      setAllowPointsPurchase(checked)
                    }
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
      </details>
    </div>
  );
}
