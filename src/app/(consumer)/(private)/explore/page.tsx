import { fetchCoupons } from '@/actions/coupon';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import Head from 'next/head';
import Script from 'next/script';
import { Suspense } from 'react';

export default async function Explore() {
  const coupons = await fetchCoupons();

  return (
    <>
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129833820581954"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="w-full p-6">
        <div className="grid w-full grid-cols-1 items-center gap-0.5 sm:grid-cols-2 md:grid-cols-3 md:gap-1">
          <Suspense fallback={<ExplorePageSkeleton />}>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <PerxCoupon
                  key={coupon.id}
                  coupon={coupon}
                  variant="consumer"
                />
              ))
            ) : (
              <p>No tickets available.</p>
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}

function ExplorePageSkeleton() {
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
