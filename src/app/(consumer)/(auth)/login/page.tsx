import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerLoginForm from '@/components/consumer/ConsumerLogin';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ConsumerLoginPage() {
  // const supabase = await createClient();
  // const { data } = await supabase.auth.getUser();

  // if (data?.user) {
  //   redirect('/home');
  // }

  return (
    <main className="h-dvh flex-row overflow-hidden font-sans lg:flex">
      <section className="relative hidden grow lg:block">
        <img
          src="/merchant-reg-illustration.jpg"
          alt="Merchant Sign-up Illustration"
          className="absolute h-full w-full object-cover"
        />
      </section>
      <section className="flex h-full flex-col items-center overflow-hidden py-8 lg:w-1/3">
        <div className="flex h-full w-4/5 flex-col gap-4">
          <div className="flex h-12 w-fit items-center">
            <ConsumerLogo logoClass="text-3xl pb-2" />
          </div>
          <ConsumerLoginForm />
        </div>
      </section>
    </main>
  );
}
