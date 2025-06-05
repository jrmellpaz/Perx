import { Clock } from 'lucide-react';
import Link from 'next/link';
import { cn, getPrimaryAccentColor } from '@/lib/utils';

import type { CouponWithRank } from '@/lib/types';

export function Coupon({
  coupon,
  variant,
}: {
  coupon: CouponWithRank;
  variant: 'merchant' | 'consumer';
}) {
  if (!coupon) return null;
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
        className={`flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border bg-white pb-2 hover:shadow-md`}
      >
        <div className="aspect-video h-auto w-full">
          <img
            src={coupon.image}
            alt={`${coupon.title} coupon`}
            className={cn('aspect-video size-full rounded-t-sm object-cover')}
          />
        </div>
        <div className="text-perx-black flex flex-col px-2 py-1">
          <p className="font-mono text-sm font-medium sm:text-base">
            {coupon.title}
          </p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="border-perx-black w-fit rounded-full border px-1.5 py-0.5">
              {coupon.category}
            </span>
            {coupon.valid_from && coupon.valid_to && (
              <Clock size={20} strokeWidth={1.5} />
            )}
            {coupon.points_amount !== 0 && (
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
        <div className="flex w-full items-center justify-start gap-1 px-2">
          <span
            style={{ color: getPrimaryAccentColor(coupon.accent_color) }}
            className="font-mono text-xl font-bold"
          >
            &#8369;
            {(coupon.discounted_price !== 0
              ? coupon.discounted_price
              : coupon.original_price
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {coupon.discounted_price > 0 && coupon.original_price && (
            <>
              <span
                style={{ color: getPrimaryAccentColor(coupon.accent_color) }}
                className="font-mono text-sm font-medium line-through opacity-75"
              >
                &#8369;
                {coupon.original_price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Save{' '}
                {Math.round(
                  ((coupon.original_price - coupon.discounted_price) /
                    coupon.original_price) *
                    100
                )}
                %
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
