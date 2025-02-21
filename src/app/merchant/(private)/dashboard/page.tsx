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

  return (
      <div className='flex gap-4 flex-col md:flex-row'>
        {/* LEFT */}
        <div className='w-full lg:w-2/3 flex flex-col gap-4'>
          {/* USER CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              <UserCard 
                title="REVENUE THIS MONTH" 
                amount="5,365" 
                icon={ArrowRight} 
                amtIcon={PhilippinePeso}
                titleClassName="mx-4 my-2 text-[18px] font-mono text-perx-white"
                amtClassName="my-5 text-[85px] font-mono text-perx-white"
                amtIconSize={90}
                bgColor='bg-perx-crimson'
                color='white'
                />
            </div>
            <div className="flex lg:flex-col gap-4">
              <UserCard 
              title="COUPONS SOLD" 
              amount="37" 
              amtIcon={Tickets}
              titleClassName="my-2 mx-3 text-[15px] font-mono text-perx-white"
              amtClassName="my-2 text-5xl font-mono text-perx-white"
              amtIconSize={30}
              bgColor='bg-perx-crimson/90'
              color='white'

              />
              <UserCard 
              title="CUSTOMERS" 
              amount="32" 
              amtIcon={UsersRound}
              titleClassName="my-2 mx-3 text-[15px] font-mono text-perx-white"
              amtClassName="my-2 text-5xl font-mono text-perx-white"
              amtIconSize={30}
              bgColor='bg-perx-crimson/90'
              color='white'

              />
            </div>
          </div>
          {/* LINE CHART */}
        <div className="w-full h-[450px]">
          <LineChart/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <TopCouponsMonth />
      </div>
    </div>
  );



}
