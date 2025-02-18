import ConsumerChangePassword from '@/components/consumer/ConsumerChangePassword';
import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ConsumerChangePasswordPage() {
  // const supabase = await createClient();
  // const { data } = await supabase.auth.getUser();

  // if (data?.user) {
  //   redirect('/merchant/dashboard');
  // }

  return (
    <div className="flex h-full w-4/5 flex-col gap-4">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerChangePassword />
    </div>
  );
}
