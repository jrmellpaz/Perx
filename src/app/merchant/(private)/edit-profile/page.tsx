import { fetchMerchantProfile } from '@/actions/merchantProfile';
import PerxHeader from '@/components/custom/PerxHeader';
import MerchantEditProfile from '@/components/merchant/MerchantEditProfile';
import { createClient } from '@/utils/supabase/server';

export default async function MerchantEditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await fetchMerchantProfile(user!.id);

  return (
    <section className="scrollable-container flex h-full w-full flex-col gap-4">
      <PerxHeader title="Edit profile" className="bg-white" />
      <MerchantEditProfile profile={profile} />
    </section>
  );
}
