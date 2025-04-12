import { fetchCouponsByConsumerId } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { createClient } from '@/utils/supabase/server';

export default async function MyCoupon() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Error fetching user.');
  }

  const purchasedCoupons = await fetchCouponsByConsumerId(user.id);

  return (
    <section className="flex flex-col gap-2 p-4">
      <h1>My Coupons</h1>
      <div className="place-start grid grid-cols-1 gap-0.5 sm:grid-cols-2 md:grid-cols-3 md:gap-1">
        {purchasedCoupons.length > 0 ? (
          purchasedCoupons.map((coupon) => (
            <PerxCoupon
              key={coupon.id}
              coupon={coupon}
              merchantId={coupon.merchantId}
              variant="consumer"
            />
          ))
        ) : (
          <p>No coupons purchased yet.</p>
        )}
      </div>
    </section>
  );
}
