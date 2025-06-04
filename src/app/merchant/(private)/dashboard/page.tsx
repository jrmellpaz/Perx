import {
  Tickets,
  UsersRound,
  ChartNoAxesCombined,
  Download,
  Banknote,
} from 'lucide-react';
import MerchantLineChart from '@/components/merchant/MerchantLineChart';
import TodayDate from '@/components/ui/date';
import ActiveCouponsTable from '@/components/ui/activetable';
import QuickAct from '@/components/ui/quickaction';
import TopCouponsRanking from '@/components/merchant/TopCouponsMonth';
import {
  fetchMonthlyRevenue,
  fetchTotalCouponsSoldByMerchant,
  fetchTotalUniqueConsumersByMerchant,
} from '@/actions/dashboard';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
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
        <div className="flex flex-col gap-3 px-1.5 py-1 sm:flex-row md:w-5/7">
          {/* mr-6 ml-3 flex w-full flex-col gap-3  sm:flex-row  */}
          <MonthlyRevenueCard />
          <TotalCouponsSoldCard />
          <TotalUniqueCustomersCard />
        </div>
        {/* QUICK ACTIONS */}
        <div className="flex gap-3 px-1.5 py-1 md:w-2/7">
          <MonthlyRecords />
          <QuickAct
            title="CSV, PDF, etc."
            value="Download"
            icon={Download}
            bgColor="bg-perx-rust/80"
            bgColor2="bg-perx-rust"
            link="/merchant/add-coupon"
          />
        </div>
      </div>
      {/* BODY */}
      {/* <div className="flex flex-col md:flex-row"> */}
      {/* LEFT */}
      {/* <div className="w-full md:w-5/7"> */}
      {/* LINE CHART */}
      {/* <div className="flex h-[325px] w-full items-center justify-center px-1.5 py-1"> */}
      {/* <MerchantLineChart /> */}
      {/* </div> */}
      {/* ACTIVE COUPONS TABLE */}
      {/* <div className="overflow-x-auto px-1.5 py-1"> */}
      {/* <ActiveCouponsTable /> */}
      {/* </div> */}
      {/* </div> */}
      {/* RIGHT */}
      {/* <div className="w-full p-1 px-1.5 md:w-2/7"> */}
      {/* <TopCouponsRanking /> */}
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}

async function MonthlyRevenueCard() {
  const revenueThisMonth = await fetchMonthlyRevenue();

  return (
    <div
      className={`bg-perx-crimson/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/3`}
    >
      <div
        className={`bg-perx-crimson/90 flex w-12 items-center justify-center rounded-2xl`}
      >
        <Banknote className="text-white" />
      </div>
      <div className="horizontal ml-2 flex flex-col justify-center">
        <span className="text-perx-white font-mono text-3xl font-semibold">
          {revenueThisMonth.toLocaleString('en-US', {
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
      className={`bg-perx-cloud/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/3`}
    >
      <div
        className={`bg-perx-cloud flex w-12 items-center justify-center rounded-2xl`}
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
      className={`bg-perx-lime/80 flex h-20 rounded-2xl p-4 shadow-[0_2px_5px_rgba(0,0,0,0.1)] md:w-1/3`}
    >
      <div
        className={`bg-perx-lime flex w-12 items-center justify-center rounded-2xl`}
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
    <Link href="/merchant/monthly-records" className="block w-full">
      <div
        className={`bg-perx-ocean/80 flex h-20 rounded-2xl p-4`}
        style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
      >
        <div
          className={`bg-perx-ocean flex w-12 items-center justify-center rounded-2xl`}
        >
          <ChartNoAxesCombined style={{ color: 'white' }} />
        </div>
        <div className="horizontal ml-2 flex flex-col justify-center">
          <span className="text-perx-white text-l font-mono font-semibold">
            View
          </span>
          <span className="text-perx-white font-sans text-sm">
            Monthly records
          </span>
        </div>
      </div>
    </Link>
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
