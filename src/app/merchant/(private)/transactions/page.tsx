import { fetchTransactionRecordById } from '@/actions/dashboard';
import PerxHeader from '@/components/custom/PerxHeader';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction details',
};

export default async function TransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { id } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata.role !== 'merchant') {
    redirect('/merchant/login');
  }

  if (!id) {
    redirect('/not-found');
  }

  const transaction = await fetchTransactionRecordById(id);

  if (!transaction) {
    redirect('/not-found');
  }

  const coupon = transaction.coupons;

  return (
    <>
      <PerxHeader title="Transaction details" className="bg-white shadow-md" />
      <div className="md mx-auto flex w-full max-w-[500px] flex-col gap-4 p-4">
        <img
          src={coupon.image}
          className="aspect-video h-auto w-full rounded-md object-cover"
        />
        <div className="flex flex-col gap-8 rounded-md bg-white p-4 shadow">
          <div className="flex flex-col gap-1">
            <p className="text-perx-black font-mono text-xl font-bold">
              {coupon.title}
            </p>
            <span className="text-perx-black border-perx-black w-fit rounded-full border px-2 py-1 text-xs">
              {coupon.category}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-perx-black text-xs font-bold md:text-sm">
                ID
              </span>
              <span className="text-perx-black text-xs md:text-sm">
                {transaction.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-perx-black text-xs font-bold md:text-sm">
                Amount
              </span>
              <span className="text-perx-black text-xs md:text-sm">
                {Number(transaction.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-perx-black text-xs font-bold md:text-sm">
                Date
              </span>
              <span className="text-perx-black text-xs md:text-sm">
                {new Date(transaction.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-perx-black text-xs font-bold md:text-sm">
                Time
              </span>
              <span className="text-perx-black text-xs md:text-sm">
                {new Date(transaction.created_at).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                (PST)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
