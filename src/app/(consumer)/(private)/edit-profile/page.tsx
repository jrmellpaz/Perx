import { getConsumerProfile } from '@/actions/consumer/profile';
import PerxHeader from '@/components/custom/PerxHeader';
import ConsumerEditProfile from '@/components/consumer/ConsumerEditProfile';
import { createClient } from '@/utils/supabase/server';

export default async function ConsumerEditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getConsumerProfile(user!.id);

  return (
    <section className="flex h-full w-full flex-col">
      <PerxHeader link="/merchant/profile" title="Edit profile" />
      <ConsumerEditProfile profile={profile} />
    </section>
  );
}
