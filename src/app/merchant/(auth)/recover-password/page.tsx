import { MerchantLogo } from '@/components/merchant/MerchantLogo';
import MerchantPasswordRecovery from '@/components/merchant/MerchantRecovery';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerchantRecoverPasswordPage() {
  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <MerchantLogo logoClass="text-3xl pb-[5px]" sublogoClass="text-2xl" />
      </div>
      <MerchantPasswordRecovery />
    </div>
  );
}
