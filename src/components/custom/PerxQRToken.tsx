'use client';

import { redeemCoupon } from '@/actions/coupon';
import { cn, getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { Coupon } from '@/lib/types';

interface PerxQRTokenProps {
  coupon: Coupon;
  qrToken: string;
}

export function PerxQRToken({ coupon, qrToken }: PerxQRTokenProps) {
  const { accent_color } = coupon;
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [redeemed, setRedeemed] = useState<boolean>(!!isRedeemed);

  const handleRedeem = () => {
    if (!qrToken) return toast.error('Missing QR token');

    startTransition(async () => {
      const result = await redeemCoupon(qrToken);

      if (result.success) {
        toast.success(result.message);
        // setRedeemed(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isLoading || isPending}
      onClick={handleRedeem}
      className={cn(
        'w-full rounded-lg px-4 py-2 text-sm font-medium text-white',
        isLoading ? 'opacity-50' : ''
      )}
      style={{
        backgroundColor: getPrimaryAccentColor(accent_color),
        color: getAccentColor(accent_color),
      }}
    >
      {isLoading ? 'Redeeming...' : 'Redeem Coupon'}
    </button>
  );
}
