import { getCoupons } from '@/actions/consumer/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import PerxHeader from '@/components/custom/PerxHeader';

export default async function Explore() {
  const coupons = await getCoupons();

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 items-center gap-0.5 sm:grid-cols-2 md:grid-cols-3 md:gap-1">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <PerxCoupon
              key={coupon.id}
              coupon={coupon}
              merchantId={coupon.merchant.id}
              variant="consumer"
            />
          ))
        ) : (
          // 'Hello'
          <p>No tickets available.</p>
        )}
      </div>
    </div>
  );
}
