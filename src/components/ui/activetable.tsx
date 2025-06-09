'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CouponTableProps {
  coupons: {
    id: string;
    title: string;
    category: string;
    valid_to: string | null;
    quantity: number;
    merchant_id: string;
  }[];
}

const ActiveCouponsTable: React.FC<CouponTableProps> = ({ coupons }) => {
  return (
    <div
      className="hide-scrollbar w-full overflow-x-auto overflow-y-auto rounded-lg sm:max-h-[200px]"
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <table className="w-full min-w-[500px] border-collapse">
        <thead
          className="sticky top-0"
          style={{ backgroundColor: 'var(--color-perx-navy)' }}
        >
          <tr>
            <th className="text-perx-white p-2 font-sans text-sm">
              Active Coupons
            </th>
            <th className="text-perx-white p-2 font-sans text-sm">Category</th>
            <th className="text-perx-white p-2 font-sans text-sm">
              Valid until
            </th>
            <th className="text-perx-white p-2 font-sans text-sm">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, idx) => (
            <tr
              key={coupon.id + idx}
              className="hover:bg-[color-mix(in srgb,var(--color-bg-perx-cloud) 70%, transparent]"
              style={{
                backgroundColor:
                  idx % 2 == 0
                    ? 'var(--color-perx-white)'
                    : 'color-mix(in srgb, var(--color-perx-cloud) 30%, transparent)',
              }}
            >
              <td className="p-3 font-sans text-sm">
                <Link
                  href={{
                    pathname: '/merchant/view',
                    query: { coupon: coupon.id, merchant: coupon.merchant_id },
                  }}
                  className="hover:text-perx-navy font-medium after:ml-1 hover:font-bold hover:after:transition-all hover:after:content-['>']"
                >
                  {coupon.title}
                </Link>
              </td>
              <td className="p-3 font-sans text-sm">{coupon.category}</td>
              <td className="p-2 text-center font-sans text-sm">
                {coupon.valid_to
                  ? new Date(coupon.valid_to).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="p-3 text-right font-sans text-sm">
                {coupon.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveCouponsTable;
