import {
  Tickets,
  UsersRound,
  ChartNoAxesCombined,
  Newspaper,
  Banknote,
  ChevronRight,
} from 'lucide-react';
import MerchantLineChart from '@/components/merchant/MerchantLineChart';
import TodayDate from '@/components/ui/date';
import ActiveCouponsTable from '@/components/ui/activetable';
import TopCouponsRanking from '@/components/merchant/TopCouponsMonth';
import {
  fetchMonthlyRevenue,
  fetchTotalCouponsSoldByMerchant,
  fetchTotalUniqueConsumersByMerchant,
} from '@/actions/dashboard';
import Link from 'next/link';
import { fetchCouponsByMerchantId } from '@/actions/coupon';
import { createClient } from '@/utils/supabase/server';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  const merchantId = user?.id;

  if (!merchantId) {
    return <div>Not authorized</div>;
  }

  const { coupons } = await fetchCouponsByMerchantId(merchantId, 0, 50, {
    isDeactivated: false,
  });

  const monthlyRevenue = await fetchMonthlyRevenue();

  return (
    // whole dashboard
    <div className="">
      {/* HEADER */}
      <div className="flex w-full items-center justify-between px-4 py-2">
        <h1 className="font-mono text-xl font-medium tracking-tighter">
          Dashboard
        </h1>
        <DateToday />
      </div>
      {/* TOP */}
      <div className="flex w-full flex-col md:flex-row">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 gap-2 px-6 py-1 md:flex md:flex-row md:gap-6 lg:w-full">
          {/* mr-6 ml-3 flex w-full flex-col gap-3  sm:flex-row  */}
          <MonthlyRevenueCard />
          <TotalCouponsSoldCard />
          <TotalUniqueCustomersCard />
          <MonthlyRecords />
        </div>
      </div>
      {/* BODY */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full">
          {/* LINE CHART */}
          <div className="justify-cente flex w-full items-center px-6 pt-2 pb-1.5">
            <MerchantLineChart data={monthlyRevenue} />
          </div>
          {/* ACTIVE COUPONS TABLE */}
          <div className="overflow-x-auto px-6 pt-1.5 pb-2">
            <ActiveCouponsTable coupons={coupons} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function MonthlyRevenueCard() {
  const revenueThisMonth = await fetchMonthlyRevenue();

  return (
    <div
      className={`bg-perx-red/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/4`}
    >
      <div
        className={`bg-perx-red/90 flex w-12 items-center justify-center rounded-2xl`}
      >
        <Banknote className="text-white" />
      </div>
      <div className="horizontal ml-2 flex flex-col justify-center">
        <span className="text-perx-white font-mono text-3xl font-semibold">
          {Number(revenueThisMonth).toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          })}
        </span>
        <span className="text-perx-white text-sm">Revenue this month</span>
      </div>
    </div>
  );
}

async function TotalCouponsSoldCard() {
  const totalCouponsSold = await fetchTotalCouponsSoldByMerchant();

  return (
    <div
      className={`bg-perx-gold/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/4`}
    >
      <div
        className={`bg-perx-gold flex w-12 items-center justify-center rounded-2xl`}
      >
        <Tickets className="text-white" />
      </div>
      <div className="horizontal ml-2 flex flex-col justify-center">
        <span className="text-perx-white font-mono text-3xl font-semibold">
          {totalCouponsSold}
        </span>
        <span className="text-perx-white text-sm">Coupons sold</span>
      </div>
    </div>
  );
}

async function TotalUniqueCustomersCard() {
  const uniqueCustomerCount = await fetchTotalUniqueConsumersByMerchant();

  return (
    <div
      className={`bg-perx-ocean/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/4`}
    >
      <div
        className={`bg-perx-ocean flex w-12 items-center justify-center rounded-2xl`}
      >
        <UsersRound className="text-white" />
      </div>
      <div className="horizontal ml-2 flex flex-col justify-center">
        <span className="text-perx-white font-mono text-3xl font-semibold">
          {uniqueCustomerCount}
        </span>
        <span className="text-perx-white text-sm">Unique customers</span>
      </div>
    </div>
  );
}

async function MonthlyRecords() {
  return (
    <div
      className={`bg-perx-navy/80 flex h-20 rounded-2xl p-4 md:w-1/4`}
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <div
        className={`bg-perx-navy flex w-12 items-center justify-center rounded-2xl`}
      >
        <Newspaper style={{ color: 'white' }} />
      </div>
      <div className="horizontal ml-2 flex w-full flex-col justify-center">
        <a href="/merchant/monthly-records" className="w-full">
          <span className="text-perx-white flex items-center justify-between font-mono text-2xl font-semibold">
            <span>View</span>
            <ChevronRight style={{ color: 'white' }} />
          </span>
        </a>
        <span className="text-perx-white font-sans text-sm">
          Transaction records
        </span>
      </div>
    </div>
  );
}

function DateToday() {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const weekday = today
    .toLocaleString('default', { weekday: 'long' })
    .toUpperCase();

  return (
    <div
      style={{
        fontFamily: 'Manrope, sans-serif',
        fontWeight: '500',
        backgroundColor: '#F7F6F5',
        padding: '10px 15px',
        borderRadius: '8px',
        display: 'inline-block',
        fontSize: '14px',
        color: 'perx-canopy',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <span style={{ color: '#9B0032' }}>{weekday}&nbsp;&nbsp;&nbsp;</span>
      {`${day} ${month} ${year}`}
    </div>
  );
}
