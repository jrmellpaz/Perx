'use client';

import { PerxDrawer } from './PerxDrawer';
import { PerxShareSheet } from './PerxShareSheet';

import type { Merchant } from '@/lib/types';

export function ShareMerchantButton({ data }: { data: Merchant }) {
  return (
    <PerxDrawer
      trigger={
        <span className="cursor-pointer rounded-md bg-neutral-100 p-3 text-sm">
          Share profile
        </span>
      }
      title="Share Perx Merchant account"
    >
      <PerxShareSheet
        url={`/merchant-profile/${data.id}/coupons`}
        title="Check out our coupons!"
        message="Check out our coupons!"
      />
    </PerxDrawer>
  );
}
