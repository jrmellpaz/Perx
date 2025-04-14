import ConsumerChangePassword from '@/components/consumer/ConsumerChangePassword';
import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ConsumerChangePasswordPage() {
  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerChangePassword />
    </div>
  );
}
