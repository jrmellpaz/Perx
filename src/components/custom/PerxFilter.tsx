'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function CouponFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [allowLimitedPurchase, setAllowLimitedPurchase] = useState(searchParams.get('allowLimitedPurchase') === 'true');
  const [allowRepeatPurchase, setAllowRepeatPurchase] = useState(searchParams.get('allowRepeatPurchase') === 'true');
  const [allowPointsPurchase, setAllowPointsPurchase] = useState(searchParams.get('allowPointsPurchase') === 'true');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice');
    maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice');
    allowLimitedPurchase ? params.set('allowLimitedPurchase', 'true') : params.delete('allowLimitedPurchase');
    allowRepeatPurchase ? params.set('allowRepeatPurchase', 'true') : params.delete('allowRepeatPurchase');
    allowPointsPurchase ? params.set('allowPointsPurchase', 'true') : params.delete('allowPointsPurchase');
    endDate ? params.set('endDate', endDate) : params.delete('endDate');

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 border rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={allowLimitedPurchase}
          onChange={(e) => setAllowLimitedPurchase(e.target.checked)}
        />
        Limited Purchase
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={allowRepeatPurchase}
          onChange={(e) => setAllowRepeatPurchase(e.target.checked)}
        />
        Repeat Purchase
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={allowPointsPurchase}
          onChange={(e) => setAllowPointsPurchase(e.target.checked)}
        />
        Points Purchase
      </label>

      <button
        onClick={applyFilters}
        className="col-span-full mt-2 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Apply Filters
      </button>
    </div>
  );
}
