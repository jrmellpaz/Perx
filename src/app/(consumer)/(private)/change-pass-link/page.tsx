import { createClient } from '@/utils/supabase/server';
import ChangePasswordButton from '@/components/merchant/MerchantChangePasswordLink';
import PerxHeader from '@/components/custom/PerxHeader';

export default async function ChangePassLink() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <section className="flex w-full flex-col items-center">
      <PerxHeader link="/settings" title="Change password" />
      <ChangePasswordButton />
    </section>
  );
}
