'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

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
    <div className="flex flex-col">
      <div className="grid w-full grid-cols-3 items-center gap-1 sm:grid-cols-4 lg:grid-cols-6">
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
        <input
          type="date"
          placeholder="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
        />
        <label className="ml-1 flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={allowLimitedPurchase}
            onChange={(e) => setAllowLimitedPurchase(e.target.checked)}
            className="accent-perx-blue"
          />
          Limited purchase
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={allowRepeatPurchase}
            onChange={(e) => setAllowRepeatPurchase(e.target.checked)}
            className="accent-perx-blue"
          />
          Repeat purchase
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={allowPointsPurchase}
            onChange={(e) => setAllowPointsPurchase(e.target.checked)}
            className="accent-perx-blue"
          />
          Points Purchase
        </label>
      </div>
      {/* <button
        onClick={applyFilters}
        className="col-start-6 w-max cursor-pointer place-self-end rounded bg-blue-500 px-2 py-1 text-xs text-white"
      >
        Apply filters
      </button> */}
      <Button
        variant="outline"
        className="h-fit w-fit cursor-pointer place-self-end rounded px-2 py-1.5 text-xs"
        onClick={applyFilters}
      >
        Apply filters
      </Button>
    </div>
  );
}
