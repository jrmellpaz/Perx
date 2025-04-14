import { fetchCoupons } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';

export default async function Explore() {
  const coupons = await fetchCoupons();

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 items-center gap-0.5 sm:grid-cols-2 md:grid-cols-3 md:gap-1">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <PerxCoupon key={coupon.id} coupon={coupon} variant="consumer" />
          ))
        ) : (
          <p>No tickets available.</p>
        )}
      </div>
    </div>
  );
}
