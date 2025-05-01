'use client';

import { fetchCoupons } from '@/actions/coupon';
import { CouponWithRank } from '@/lib/types';
import { useEffect, useState } from 'react';
import { LoadMore } from '../custom/PerxInfiniteScroll';
import { Coupon } from '../custom/Coupon';

interface ExploreListProps {
  userId: string | undefined;
}

export function ExploreList({ userId }: ExploreListProps) {
  const [coupons, setCoupons] = useState<CouponWithRank[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = 9;

  const loadCoupons = async () => {
    setIsLoading(true);
    const { coupons: newCoupons, count: fetchCount } = await fetchCoupons(
      userId,
      offset,
      LIMIT
    );

    if (fetchCount < LIMIT) {
      setHasMore(false);
    }

    setCoupons((prev) => [...prev, ...newCoupons]);
    setOffset((prev) => prev + LIMIT);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadCoupons();
  }, []);

  return (
    <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
      {coupons.length > 0 ? (
        <>
          {coupons.map((coupon, index) => (
            <Coupon key={index} coupon={coupon} variant="consumer" />
          ))}
          {hasMore && (
            <LoadMore onLoadMore={loadCoupons} isLoading={isLoading} />
          )}
        </>
      ) : (
        <ExplorePageSkeleton />
      )}
    </div>
  );
}

function ExplorePageSkeleton() {
  return (
    <>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse rounded-md"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse rounded-md"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
      <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-md border">
        <div className="bg-muted aspect-video w-full animate-pulse rounded-md"></div>
        <div className="flex flex-col gap-1.5 px-2 py-2">
          <div className="bg-muted h-6 w-3/4 rounded-md"></div>
          <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
