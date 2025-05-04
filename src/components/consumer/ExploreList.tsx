'use client';

import { fetchCoupons } from '@/actions/coupon';
import { useEffect, useState } from 'react';
import { LoadMore } from '../custom/PerxLoadMore';
import { Coupon } from '../custom/Coupon';
import { CouponGridSkeleton } from '../custom/PerxSkeleton';

import type { CouponWithRank } from '@/lib/types';

interface ExploreListProps {
  userId: string | undefined;
}

export function ExploreList({ userId }: ExploreListProps) {
  const [coupons, setCoupons] = useState<CouponWithRank[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = 12;

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
        <CouponGridSkeleton />
      )}
    </div>
  );
}
