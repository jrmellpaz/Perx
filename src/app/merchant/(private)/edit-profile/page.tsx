import { fetchMerchant } from '@/actions/merchantProfile';
import PerxHeader from '@/components/custom/PerxHeader';
import MerchantEditProfile from '@/components/merchant/MerchantEditProfile';
import { createClient } from '@/utils/supabase/server';

export default async function MerchantEditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await fetchMerchant(user!.id);

  return (
    <section className="scrollable-container flex h-full w-full flex-col items-center gap-4">
      <PerxHeader title="Edit profile" className="bg-white shadow-md" />
      <MerchantEditProfile profile={profile} />
    </section>
  );
}
