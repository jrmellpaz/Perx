import { fetchRank } from '@/actions/rank';
import { Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

import type { Coupon } from '@/lib/types';

export async function PerxCoupon({
  coupon,
  variant,
}: {
  coupon: Coupon;
  variant: 'merchant' | 'consumer';
}) {
  const { icon: rankIcon } = await fetchRank(coupon.rankAvailability);

  return (
    <Link
      href={{
        pathname: variant === 'merchant' ? '/merchant/view' : '/view',
        query: { coupon: coupon.id, merchant: coupon.merchantId },
      }}
      key={coupon.id}
    >
      <div
        className={`bg-perx-white flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border pb-2`}
      >
        <div className="coupon-image aspect-video h-auto w-full">
          <img
            src={coupon.image ?? ''}
            alt={`${coupon.title} coupon`}
            className="aspect-video h-auto w-full rounded-sm object-cover"
          />
        </div>
        <div className="text-perx-black flex flex-col gap-1.5 px-2 py-1">
          <p className="text-sm font-medium sm:text-base">{coupon.title}</p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="border-perx-black w-fit rounded-full border px-1.5 py-0.5">
              {coupon.category}
            </span>
            {coupon.allowLimitedPurchase && (
              <Clock size={20} strokeWidth={1.5} />
            )}
            {coupon.allowPointsPurchase && (
              <Sparkles size={20} strokeWidth={1.5} />
            )}
            <img src={rankIcon} alt={'Rank icon'} className="size-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}
