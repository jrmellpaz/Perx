import { getMerchantProfile } from '@/actions/merchant/profile';
import PerxHeader from '@/components/custom/PerxHeader';
import MerchantEditProfile from '@/components/merchant/MerchantEditProfile';
import { createClient } from '@/utils/supabase/server';

export default async function MerchantEditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getMerchantProfile(user!.id);

  return (
    <section className="flex h-full w-full flex-col">
      <PerxHeader link="/merchant/profile" title="Edit profile" />
      <MerchantEditProfile profile={profile} />
    </section>
  );
}
