import { getMerchantProfile } from '@/actions/merchant/profile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { MerchantCoupon } from '@/lib/merchant/couponSchema';
import { redirect } from 'next/navigation';

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

  const coupon: MerchantCoupon = JSON.parse(couponData);
  const merchantData = await getMerchantProfile(merchantId);

  return (
    <section className="h-full w-full overflow-hidden">
      <PerxTicket
        couponData={coupon}
        merchantData={merchantData}
        variant="merchant"
      />
    </section>
  );
}
