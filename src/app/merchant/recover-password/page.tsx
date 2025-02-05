import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerchantRecoverPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/merchant/dashboard');
  }

  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Recover password</h1>
      <form className="flex h-full flex-col justify-between"></form>
    </section>
  );
}
