import { fetchCouponsByMerchantId } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CouponsTab({
    params,
} : {
  params: Promise<{ merchantId: string }>
}) {
  const { merchantId } = await params
  const coupons = await fetchCouponsByMerchantId(merchantId);
  console.log('Merchant Profile Data:', coupons);
  return (
    <div className="mb-4 grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:px-8 md:grid-cols-3 md:gap-1">
      {coupons.map((coupon) => (
        <PerxCoupon coupon={coupon} key={coupon.id} variant="merchant" />
      ))}
    </div>
  );
}
