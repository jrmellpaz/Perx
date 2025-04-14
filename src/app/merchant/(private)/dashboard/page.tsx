import UserCard from '@/components/merchant/Usercard';
import { ArrowRight, Tickets, UsersRound, PhilippinePeso } from 'lucide-react';
import LineChart from '@/components/merchant/LineChart';
import TopCouponsMonth from '@/components/merchant/TopCouponsMonth';

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-4 lg:w-2/3">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            <UserCard
              title="REVENUE THIS MONTH"
              amount="5,365"
              icon={ArrowRight}
              amtIcon={PhilippinePeso}
              titleClassName="mx-4 my-2 text-[18px] font-mono text-perx-white"
              amtClassName="text-6xl font-mono text-perx-white"
              amtIconSize={60}
              bgColor="bg-perx-canopy"
              color="white"
              textColor=""
            />
          </div>
          <div className="flex gap-4 lg:flex-col">
            <UserCard
              title="COUPONS SOLD"
              amount="37"
              amtIcon={Tickets}
              titleClassName="my-2 mx-3 text-[15px] font-mono text-perx-white"
              amtClassName="my-2 text-5xl font-mono text-perx-white"
              amtIconSize={30}
              bgColor="bg-perx-crimson/85"
              color="white"
            />
            <UserCard
              title="CUSTOMERS"
              amount="32"
              amtIcon={UsersRound}
              titleClassName="my-2 mx-3 text-[15px] font-mono text-perx-white"
              amtClassName="my-2 text-5xl font-mono text-perx-white"
              amtIconSize={30}
              bgColor="bg-perx-navy/85"
              color="white"
            />
          </div>
        </div>
        {/* LINE CHART */}
        <div className="h-[450px] w-full">
          <LineChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <TopCouponsMonth />
      </div>
    </div>
  );
}
