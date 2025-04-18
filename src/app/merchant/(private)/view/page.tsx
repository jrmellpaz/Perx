import { fetchMerchantProfile } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';
import { fetchCoupon } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { getPrimaryAccentColor } from '@/lib/utils';

import type { Coupon, Merchant } from '@/lib/types';

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const couponId = (await searchParams).coupon;
  const merchantId = (await searchParams).merchant;

  if (!couponId || !merchantId) {
    redirect('/not-found');
  }

  const coupon: Coupon = await fetchCoupon(couponId);
  const merchant: Merchant = await fetchMerchantProfile(merchantId);

  return (
    <section className="h-max w-full overflow-y-auto bg-transparent">
      <PerxHeader
        title=""
        className="text-white"
        style={{ backgroundColor: getPrimaryAccentColor(coupon.accentColor) }}
        buttonStyle={{
          backgroundColor: getPrimaryAccentColor(coupon.accentColor),
        }}
      />
      <PerxTicket
        couponData={coupon}
        merchantData={merchant}
        variant="merchant"
      ></PerxTicket>
    </section>
  );
}
