import { logoutMerchant } from '@/actions/merchant/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import UserCard from '@/components/merchant/Usercard';
import {
  ArrowRight,
  Tickets,
  ShoppingCart,
  UsersRound,
  PhilippinePeso,
  EllipsisVertical,
} from 'lucide-react';
import { profile } from 'console';
import LineChart from '@/components/merchant/lineChart';
import TopCouponsMonth from '@/components/merchant/TopCouponsMonth';
// import EventCalendar from '@/components/merchant/EventCalendar';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // if (error || !data?.user) {
  //   redirect('/merchant/login');
  // }

  // return (
  //   <div>
  //     <h1>Dashboard</h1>
  //     <p>Welcome, {data?.user?.email}</p>
  //     <form action={logoutMerchant}>
  //       <Button type="submit">Log out</Button>
  //     </form>
  //   </div>
  // );

  // return (
  //   <div className='p-4 flex gap-4 flex-col md:flex-row'>
  //     {/* LEFT */}
  //     <div className='w-full lg:w-1/3'>L</div>
  //     {/* USER CARDS */}
  //     <div className='flex gap-4 justify-between flex-wrap'>
  //       <UserCard type="revenue"/>
  //       <UserCard type="coupons Sold"/>
  //       <UserCard type="costumers"/>
  //       <UserCard type="extra"/>
  //     </div>
  //     {/* RIGHT */}
  //     <div className='w-full lg:w-1/3'>R</div>
  //   </div>

  // );

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-4 lg:w-2/3">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UserCard
            title="REVENUE THIS MONTH"
            amount="5,365"
            icon={ArrowRight}
            amtIcon={PhilippinePeso}
          />
          <UserCard title="COUPONS SOLD" amount="37" amtIcon={Tickets} />
          <UserCard title="CUSTOMERS" amount="32" amtIcon={UsersRound} />
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

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //     <UserCard title="REVENUE THIS MONTH" amount="5,365" icon={ArrowRight} amtIcon={PhilippinePeso}/>
  //     <UserCard title="COUPONS SOLD" amount="37" amtIcon={Tickets}/>
  //     <UserCard title="CUSTOMERS" amount="32" amtIcon={UsersRound}/>
  //     {/* <UserCard type="guest" /> */}
  //   </div>
  // );
}
