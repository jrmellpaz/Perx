import { MerchantLogo } from '@/components/merchant/MerchantLogo';
import MerchantRegisterForm from '@/components/merchant/RegisterForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerchantRegisterPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/merchant/dashboard');
  }

  return (
    <div className="flex h-full w-4/5 flex-col gap-4">
      <div className="flex h-12 w-fit items-center">
        <MerchantLogo logoClass="text-3xl pb-[5px] " sublogoClass="text-2xl" />
      </div>
      <MerchantRegisterForm />
    </div>
  );
}
