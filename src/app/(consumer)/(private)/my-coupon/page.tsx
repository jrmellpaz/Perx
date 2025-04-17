import { fetchCouponsByConsumerId } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { Coupon } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function MyCouponsPage() {
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
      <div className="place-start grid grid-cols-1 gap-0.5 sm:grid-cols-2 md:grid-cols-3 md:gap-1">
        <Suspense fallback={<MyCouponsSkeleton />}>
          {purchasedCoupons.length > 0 ? (
            purchasedCoupons.map((coupon) => {
              const couponDetails = coupon.coupons;

              return <MyCoupon key={couponDetails.id} coupon={couponDetails} />;
            })
          ) : (
            <p>No coupons purchased yet.</p>
          )}
        </Suspense>
      </div>
    </section>
  );
}

function MyCoupon({ coupon }: { coupon: Coupon }) {
  return (
    <Link
      href={{
        pathname: '/view',
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
          <span className="border-perx-black w-fit rounded-full border px-1.5 py-0.5 text-[10px] md:text-xs">
            {coupon.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
function MyCouponsSkeleton() {
  return (
    <>
      <div className="bg-perx-white h-32 w-full rounded-md">
        <div className="coupon-image bg-muted aspect-video h-auto w-full animate-pulse rounded-sm"></div>
        <div className="flex flex-col gap-1.5 px-2 py-1">
          <p className="bg-muted h-8 w-3/4 animate-pulse rounded-md"></p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="bg-muted h-4 w-2/5 animate-pulse rounded-md px-1.5 py-0.5"></span>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-perx-white h-32 w-full rounded-md">
        <div className="coupon-image bg-muted aspect-video h-auto w-full animate-pulse rounded-sm"></div>
        <div className="flex flex-col gap-1.5 px-2 py-1">
          <p className="bg-muted h-8 w-3/4 animate-pulse rounded-md"></p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="bg-muted h-4 w-2/5 animate-pulse rounded-md px-1.5 py-0.5"></span>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-perx-white h-32 w-full rounded-md">
        <div className="coupon-image bg-muted aspect-video h-auto w-full animate-pulse rounded-sm"></div>
        <div className="flex flex-col gap-1.5 px-2 py-1">
          <p className="bg-muted h-8 w-3/4 animate-pulse rounded-md"></p>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="bg-muted h-4 w-2/5 animate-pulse rounded-md px-1.5 py-0.5"></span>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
            <div className="bg-muted h-4 w-4 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
