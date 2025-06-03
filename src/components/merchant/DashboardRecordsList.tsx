'use client';

import { useEffect, useState } from 'react';
import { LoadMore, TransactionLoading } from '../custom/PerxLoadMore';
import { CouponGridSkeleton } from '../custom/PerxSkeleton';
import { Button } from '../ui/button';
import { ChevronRight, LoaderCircle } from 'lucide-react';
import { fetchTransactionRecordsByMerchant } from '@/actions/dashboard';

import type { TransactionWithCoupon } from '@/lib/types';
import { cn } from '@/lib/utils';

export function DashboardRecordsList() {
  const [transactions, setTransactions] = useState<TransactionWithCoupon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = 12;

  const loadTransactions = async () => {
    setIsLoading(true);
    const { transactions: newTransactions, count: fetchCount } =
      await fetchTransactionRecordsByMerchant(offset, LIMIT);

    if (fetchCount < LIMIT) {
      setHasMore(false);
    }

    setTransactions((prev) => [...prev, ...newTransactions]);
    setOffset((prev) => prev + LIMIT);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadTransactions();
  }, []);

  return (
    <section className="mx-auto flex h-auto w-full max-w-[800px] flex-col divide-y-2">
      {transactions.length > 0 ? (
        <>
          {transactions.map((transaction, index) => (
            <TransactionRecordCard key={index} transaction={transaction} />
          ))}
          {hasMore && (
            <TransactionLoading
              onLoadMore={loadTransactions}
              isLoading={isLoading}
            />
          )}
        </>
      ) : hasMore ? (
        <Loading className={'h-full bg-red-400'} />
      ) : (
        <p>No transactions found.</p>
      )}
    </section>
  );
}

function TransactionRecordCard({
  transaction,
}: {
  transaction: TransactionWithCoupon;
}) {
  const coupon = transaction.coupons;
  return (
    <div className="flex h-auto w-full items-center justify-between gap-4 bg-white p-4">
      <div className="flex grow items-center justify-between">
        <div className="flex grow flex-col">
          <p className="text-xs text-neutral-500">
            {new Date(transaction.created_at).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
          <p className="font-mono font-semibold">{coupon.title}</p>
        </div>
        <span className="font-mono font-bold text-green-600">
          {Number(transaction.price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          })}
        </span>
      </div>
      <Button variant="ghost" className="aspect-square h-auto rounded-full p-4">
        <ChevronRight />
      </Button>
    </div>
  );
}

function Loading({ className }: { className?: string }) {
  return (
    <div className="mt-2 mb-6 flex w-full max-w-[800px] flex-col gap-2">
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </div>
  );
}
