// app/merchant/profile/@tabs/coupons/page.tsx
import { getMerchantCoupons } from '@/actions/merchant/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { createClient } from '@/utils/supabase/server';
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
        <PerxCoupon
          coupon={coupon}
          merchantId={user!.id}
          key={coupon.id}
          variant="merchant"
        />
      ))}
    </div>
  );
}
