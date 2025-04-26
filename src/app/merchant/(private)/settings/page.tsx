import { createClient } from '@/utils/supabase/server';
import PerxHeader from '@/components/custom/PerxHeader';
import {
  AccountSection,
  LoginSection,
} from '@/components/merchant/MerchantSettings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return <div>Error fetching user data</div>;
  }

  return (
    <section className="scrollable-container flex h-full w-full flex-col items-center gap-6">
      <PerxHeader title="Settings" className="bg-white shadow-md" />
      <div className="flex w-full max-w-[800px] flex-col gap-8 px-4">
        <AccountSection user={user} />
        <LoginSection />
      </div>
    </section>
  );
}
