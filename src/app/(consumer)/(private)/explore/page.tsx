import { fetchCoupons } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { Suspense } from 'react';

export default async function Explore() {
  const coupons = await fetchCoupons();

  return (
    <section className="w-full px-2 py-4 sm:px-4">
      <div className="grid w-full grid-cols-1 items-center gap-1 sm:grid-cols-2 md:grid-cols-3 md:gap-2">
        <Suspense fallback={<ExplorePageSkeleton />}>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <PerxCoupon key={coupon.id} coupon={coupon} variant="consumer" />
            ))
          ) : (
            <p>No tickets available.</p>
          )}
        </Suspense>
      </div>
    </section>
  );
}

function ExplorePageSkeleton() {
  return (
    <>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
