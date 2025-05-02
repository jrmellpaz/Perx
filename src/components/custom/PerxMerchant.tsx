import Link from 'next/link';

import type { Merchant } from '@/lib/types';

export function MerchantCard({ merchant }: { merchant: Merchant }) {
  return (
    <Link href={`/merchant-profile/${merchant.id}/coupons`}>
      <div className="flex flex-col gap-2 rounded-md border bg-white p-4 hover:shadow-md">
        <div className="flex items-center-safe gap-3">
          <img
            src={merchant.logo}
            className="aspect-square size-10 rounded-full border"
          />
          <h2 className="font-mono text-lg font-bold">{merchant.name}</h2>
        </div>
        <p className="text-sm text-gray-600">{merchant.bio}</p>
        <p className="text-xs text-gray-400">{merchant.address}</p>
      </div>
    </Link>
  );
}
