import MerchantLoginForm from '@/components/merchant/MerchantLogin';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerchantLoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/merchant/dashboard');
  }

  return (
    <main className="h-dvh flex-row overflow-x-hidden font-sans lg:flex">
      <section className="relative hidden grow lg:block">
        <img
          src="/merchant-reg-illustration.jpg"
          alt="Merchant Sign-up Illustration"
          className="absolute h-full w-full object-cover"
        />
      </section>
      <section className="flex h-full flex-col items-center overflow-x-hidden py-8 lg:w-1/3">
        <div className="flex h-full w-4/5 flex-col gap-4">
          <div className="flex h-12 w-fit items-center">
            <MerchantLogo
              logoClass="text-3xl pb-[5px] "
              sublogoClass="text-2xl"
            />
          </div>
          <MerchantLoginForm />
        </div>
      </section>
    </main>
  );
}
