import UserCard from '@/components/merchant/Usercard';
import {
  ArrowRight,
  Tickets,
  UsersRound,
  PhilippinePeso,
  ChartNoAxesCombined,
  Download,
} from 'lucide-react';
import MerchantLineChart from '@/components/merchant/MerchantLineChart';
import TopCouponsMonth from '@/components/merchant/TopCouponsMonth';
import TodayDate from '@/components/ui/date';
import ActiveCouponsTable from '@/components/ui/activetable';
import QuickAct from '@/components/ui/quickaction';
import Link from 'next/link';
import TopCouponsRanking from '@/components/merchant/TopCouponsMonth';

export default async function DashboardPage() {
  return (
    // whole dashboard
    <div className="">
      {/* HEADER */}
      <div className="flex w-full items-center justify-between px-4 py-2">
        <h1 className="text-xl font-medium tracking-tighter">Dashboard</h1>
        <TodayDate />
      </div>
      {/* TOP */}
      <div className="flex w-full flex-col md:flex-row">
        {/* USER CARDS */}
        <div className="flex flex-col gap-3 px-1.5 py-1 sm:flex-row md:w-5/7">
          {/* mr-6 ml-3 flex w-full flex-col gap-3  sm:flex-row  */}
          <UserCard
            title="Revenue this month"
            value="50,000"
            icon={PhilippinePeso}
            bgColor="bg-perx-crimson/80"
            bgColor2="bg-perx-crimson/90"
          />
          <UserCard
            title="Total Coupons Sold"
            value="50,000"
            icon={Tickets}
            bgColor="bg-perx-cloud/80"
            bgColor2="bg-perx-cloud"
          />
          <UserCard
            title="Total Unique Customers"
            value="50,000"
            icon={UsersRound}
            bgColor="bg-perx-lime/80"
            bgColor2="bg-perx-lime"
          />
        </div>
        {/* QUICK ACTIONS */}
        <div className="flex gap-3 px-1.5 py-1 md:w-2/7">
          {/* flex w-full gap-3  */}
          <QuickAct
            title="MonthlyRecs"
            value="View"
            icon={ChartNoAxesCombined}
            bgColor="bg-perx-ocean/80"
            bgColor2="bg-perx-ocean"
            link="/merchant/monthly-records"
          />
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
      <div className="flex flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full md:w-5/7">
          {/* LINE CHART */}
          <div className="flex h-[325px] w-full items-center justify-center px-1.5 py-1">
            <MerchantLineChart />
          </div>
          {/* ACTIVE COUPONS TABLE */}
          <div className="overflow-x-auto px-1.5 py-1">
            <ActiveCouponsTable />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full p-1 px-1.5 md:w-2/7">
          <TopCouponsRanking />
        </div>
      </div>
    </div>
  );
}
