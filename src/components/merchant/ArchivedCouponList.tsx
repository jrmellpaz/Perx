'use client';

import { useEffect, useState } from 'react';
import { fetchCouponsByMerchantId } from '@/actions/coupon';
import { CouponGridSkeleton } from '../custom/PerxSkeleton';
import { Coupon } from '../custom/Coupon';
import { LoadMore } from '../custom/PerxLoadMore';

import type { CouponWithRank } from '@/lib/types';

interface CouponListProps {
  userId: string;
}

export function ArchivedCouponList({ userId }: CouponListProps) {
  const [coupons, setCoupons] = useState<CouponWithRank[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = 12;

  const loadCoupons = async () => {
    setIsLoading(true);

    const { coupons: newCoupons, count: fetchCount } =
      await fetchCouponsByMerchantId(userId, offset, LIMIT, {
        isDeactivated: true,
      });

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
    <div className="mb-4 grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:px-8 md:grid-cols-3 md:gap-1">
      {coupons.length > 0 ? (
        <>
          {coupons.map((coupon, index) => (
            <Coupon coupon={coupon} key={index} variant="merchant" />
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
