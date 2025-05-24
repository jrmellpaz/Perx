import { fetchConsumerCoupons } from '@/actions/coupon';
import { PerxLogoHeader } from '@/components/custom/PerxHeader';
import { ConsumerCoupon } from '@/lib/types';
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

  const purchasedCoupons = await fetchConsumerCoupons(user.id);

  return (
    <>
      <PerxLogoHeader />
      <section className="overflow-y-auto px-2 py-4 sm:px-4">
        <div className="place-start grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
          <Suspense fallback={<MyCouponsSkeleton />}>
            {purchasedCoupons.length > 0 ? (
              purchasedCoupons.map((coupon, index) => {
                return <MyCoupon key={index} coupon={coupon} />;
              })
            ) : (
              <p>No coupons purchased yet.</p>
            )}
          </Suspense>
        </div>
      </section>
    </>
  );
}

function MyCoupon({ coupon }: { coupon: ConsumerCoupon }) {
  const couponDetails = coupon.details as {
    title: string;
    image: string;
    category: string;
    description: string;
    accent_color: string;
  };

  return (
    <Link
      href={{
        pathname: '/my-coupons/view',
        query: { coupon: coupon.id },
      }}
    >
      <div
        className={`bg-perx-white flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border pb-2`}
      >
        <div className="aspect-video h-full w-auto">
          <img
            src={couponDetails.image}
            alt={`${couponDetails.title} coupon`}
            className="size-full rounded-t-sm object-cover"
          />
        </div>
        <div className="text-perx-black flex flex-col gap-1.5 px-2 py-1">
          <p className="font-mono text-sm font-medium sm:text-base">
            {couponDetails.title}
          </p>
          <span className="border-perx-black w-fit rounded-full border px-1.5 py-0.5 text-[10px] md:text-xs">
            {couponDetails.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
function MyCouponsSkeleton() {
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
