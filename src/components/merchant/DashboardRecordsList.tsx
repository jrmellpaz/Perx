'use client';

import { useEffect, useState } from 'react';
import { TransactionLoading } from '../custom/PerxLoadMore';
import { Button } from '../ui/button';
import { ChevronRight, LoaderCircle } from 'lucide-react';
import { fetchTransactionRecordsByMerchant } from '@/actions/dashboard';

import type { TransactionWithCoupon } from '@/lib/types';
import Link from 'next/link';

export function DashboardRecordsList() {
  const [transactions, setTransactions] = useState<TransactionWithCoupon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const LIMIT = 100;

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

  const handleDownloadCsv = async () => {
    setIsDownloading(true);
    let allTransactions: TransactionWithCoupon[] = [];
    let offset = 0;
    const LIMIT = 1000;
    let hasMORE = true;

    while (hasMORE) {
      const { transactions } = await fetchTransactionRecordsByMerchant(
        offset,
        LIMIT
      );
      allTransactions = allTransactions.concat(transactions);
      hasMORE = transactions.length === LIMIT;
      offset += LIMIT;
    }

    if (allTransactions.length === 0) {
      alert('No transactions to download.');
      setIsDownloading(false);
      return;
    }

    const headers = ['Date', 'Coupon Title', 'Category', 'Price'];
    const rows = allTransactions.map((transaction) => {
      const date = new Date(transaction.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const couponTitle = transaction.coupons.title;
      const couponCategory = transaction.coupons.category || 'N/A';
      const price = Number(transaction.price).toFixed(2);
      return `${date}, "${couponTitle.replace(/"/g, '""')}", "${couponCategory.replace(/'"/g, '""')}","${price.replace(/"/g, '""')}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv:charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transaction_record.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadTransactions();
  }, []);

  return (
    <>
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
          <Loading />
        ) : (
          <p>No transactions found.</p>
        )}
      </section>

      <Button
        onClick={handleDownloadCsv}
        disabled={isDownloading || transactions.length === 0}
        className="fixed right-15 bottom-5 z-50 shadow-lg"
      >
        {isDownloading ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{' '}
            Downloading...
          </>
        ) : (
          'Download full report'
        )}
      </Button>
    </>
  );
}

function TransactionRecordCard({
  transaction,
}: {
  transaction: TransactionWithCoupon;
}) {
  const coupon = transaction.coupons;
  return (
    <Link
      href={{
        pathname: '/merchant/view',
        query: { coupon: coupon.id, merchant: coupon.merchant_id },
      }}
    >
      <div className="flex h-auto w-full items-center justify-between gap-4 bg-white p-4">
        <div className="flex grow items-center justify-between">
          <div className="flex grow flex-col rounded-2xl">
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
        <Button
          variant="ghost"
          className="aspect-square h-auto rounded-full p-4"
        >
          <ChevronRight />
        </Button>
      </div>
    </Link>
  );
}

function Loading() {
  return (
    <div className="mt-2 mb-6 flex w-full max-w-[800px] flex-col gap-2">
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
      <div className="h-12 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </div>
  );
}
