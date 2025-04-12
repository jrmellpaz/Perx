import { getMerchantProfile } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';

import type { Coupon } from '@/lib/types';

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const couponData = (await searchParams).coupon;
  const merchantId = (await searchParams).merchantId;

  if (!couponData || !merchantId) {
    redirect('/not-found');
  }

  const coupon: Coupon = JSON.parse(couponData);
  const merchantData = await getMerchantProfile(merchantId);

  return (
    <section className="h-full w-full overflow-hidden">
      <PerxTicket
        couponData={coupon}
        merchantData={merchantData}
        variant="consumer"
      />
    </section>
  );
}
