'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

import type { CouponWithRank } from '@/lib/types';

export function Coupon({
  coupon,
  variant,
}: {
  coupon: CouponWithRank;
  variant: 'merchant' | 'consumer';
}) {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const rankIcon = coupon.ranks.icon;

  return (
    <Link
      href={{
        pathname: variant === 'merchant' ? '/merchant/view' : '/view',
        query: { coupon: coupon.id, merchant: coupon.merchant_id },
      }}
      key={coupon.id}
    >
      <div
        className={`flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border pb-2 hover:shadow-md`}
      >
        <div className="coupon-image aspect-video h-auto w-full">
          {!isImageLoaded && (
            <div className="bg-perx-white absolute inset-0 animate-pulse rounded-md"></div>
          )}

          <img
            onLoad={() => setIsImageLoaded(true)}
            src={coupon.image}
            alt={`${coupon.title} coupon`}
            className={cn(
              'aspect-video h-auto w-full rounded-sm object-cover transition-opacity duration-1000',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
        <div className="text-perx-black flex flex-col gap-1.5 px-2 py-1">
          <p className="text-sm font-medium sm:text-base">{coupon.title}</p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="border-perx-black w-fit rounded-full border px-1.5 py-0.5">
              {coupon.category}
            </span>
            {coupon.allow_limited_purchase && (
              <Clock size={20} strokeWidth={1.5} />
            )}
            {coupon.allow_points_purchase && (
              <img
                src="/reward-points.svg"
                alt="Reward Points"
                width={20}
                height={20}
                className="pb-0.25"
              />
            )}
            <img src={rankIcon} alt={'Rank icon'} className="size-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}
