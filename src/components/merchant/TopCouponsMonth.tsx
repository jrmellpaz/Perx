'use client';

import React, { useEffect, useState } from 'react';

interface TopCoupon {
  id: string;
  name: string;
  category: string;
  purchases: number;
}

const TopCouponsRanking = () => {
  const [topCoupons, setTopCoupons] = useState<TopCoupon[]>([]);

  useEffect(() => {
    // Mock data - replace with your API call
    const mockData: TopCoupon[] = [
      {
        id: '1',
        name: 'SUMMER2024',
        category: 'Seasonal',
        purchases: 1250,
      },
      {
        id: '2',
        name: 'FREESHIPPING',
        category: 'Shipping',
        purchases: 982,
      },
      {
        id: '3',
        name: 'WELCOME20',
        category: 'New Users',
        purchases: 756,
      },
      {
        id: '4',
        name: 'FLASHSALE24',
        category: 'Limited',
        purchases: 680,
      },
      {
        id: '5',
        name: 'LOYALTY15',
        category: 'Members',
        purchases: 592,
      },
      {
        id: '6',
        name: 'NEWUSER10',
        category: 'Signup',
        purchases: 543,
      },
      {
        id: '7',
        name: 'BULKSAVE',
        category: 'Wholesale',
        purchases: 487,
      },
      {
        id: '8',
        name: 'WEEKENDDEAL',
        category: 'Promo',
        purchases: 432,
      },
      {
        id: '9',
        name: 'FIRSTORDER',
        category: 'New',
        purchases: 398,
      },
      {
        id: '10',
        name: 'CLEARANCE',
        category: 'Sale',
        purchases: 356,
      },
    ];
    setTopCoupons(mockData);
  }, []);

  return (
    <div className="flex h-[540px] flex-col rounded-xl border border-[color-mix(in_srgb,var(--color-perx-cloud)_30%,transparent)] bg-[var(--color-perx-white)] p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-sans text-lg font-bold text-[var(--color-perx-navy)]">
          Top 10 Coupons this month
        </h2>
      </div>

      {/* Column Headers (Sticky) */}
      <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 border-b border-[color-mix(in_srgb,var(--color-perx-cloud)_30%,transparent)] bg-[var(--color-perx-white)] px-3 py-2 font-sans text-sm font-semibold tracking-wider text-[var(--color-perx-navy)] uppercase">
        <div className="col-span-1">#</div>
        <div className="col-span-7">Coupon</div>
        <div className="col-span-4 text-right">Purchases</div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-1">
        {topCoupons.map((coupon, index) => (
          <div
            key={`${coupon.id}-${index}`}
            className="grid grid-cols-12 items-center gap-2 rounded-lg p-3 transition-all hover:bg-[color-mix(in_srgb,var(--color-perx-cloud)_15%,transparent)]"
            style={{
              borderLeft: `4px solid ${
                index === 0
                  ? 'var(--color-perx-crimson)'
                  : index === 1
                    ? 'var(--color-perx-ocean)'
                    : index === 2
                      ? 'var(--color-perx-lime)'
                      : 'transparent'
              }`,
            }}
          >
            {/* Rank */}
            <div className="col-span-1">
              <div
                className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  index < 3 ? 'text-white' : 'text-[var(--color-perx-black)]'
                }`}
                style={{
                  backgroundColor:
                    index === 0
                      ? 'var(--color-perx-crimson)'
                      : index === 1
                        ? 'var(--color-perx-ocean)'
                        : index === 2
                          ? 'var(--color-perx-lime)'
                          : 'var(--color-perx-cloud)',
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* Coupon Info */}
            <div className="col-span-7">
              <div className="truncate font-medium">{coupon.name}</div>
              <div className="truncate text-xs text-[color-mix(in_srgb,var(--color-perx-black)_60%,transparent)]">
                {coupon.category}
              </div>
            </div>

            {/* Purchases */}
            <div className="col-span-4 text-right">
              <span className="font-mono text-sm font-bold">
                {coupon.purchases.toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-[color-mix(in_srgb,var(--color-perx-black)_60%,transparent)]">
                orders
              </span>
            </div>
          </div>
        ))}

        {topCoupons.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-sm text-[var(--color-perx-navy)] opacity-70">
              No coupon data available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCouponsRanking;
