// app/merchant/profile/@tabs/coupons/page.tsx
import { getMerchantCoupons } from '@/actions/merchant/coupon';
import { fetchRank } from '@/actions/rank';
import { MerchantCoupon } from '@/lib/merchant/couponSchema';
import { createClient } from '@/utils/supabase/server';
import { Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CouponsTab() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/not-found');
  }

  const coupons = await getMerchantCoupons(user!.id);

  return (
    <div className="mb-4 grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:px-8 md:grid-cols-3 md:gap-1">
      {coupons.map((coupon) => (
        <Coupon coupon={coupon} merchantId={user!.id} key={coupon.id} />
      ))}
    </div>
  );
}

async function Coupon({
  coupon,
  merchantId,
}: {
  coupon: MerchantCoupon;
  merchantId: string;
}) {
  const { icon: rankIcon } = await fetchRank(coupon.consumerAvailability);

  return (
    <Link
      href={{
        pathname: '/merchant/view',
        query: { coupon: JSON.stringify(coupon), merchantId: merchantId },
      }}
      key={coupon.id}
    >
      <div
        className={`flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border pb-2`}
      >
        <div className="coupon-image aspect-video h-auto w-full">
          <img
            src={coupon.image}
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
            <img src="/bronze-icon.svg" alt={'Rank icon'} className="size-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
