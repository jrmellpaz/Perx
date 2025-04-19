import PerxHeader from '@/components/custom/PerxHeader';
import ConsumerEditProfile from '@/components/consumer/ConsumerEditProfile';
import { createClient } from '@/utils/supabase/server';

import { fetchConsumerProfile } from '@/actions/consumerProfile';

export default async function ConsumerEditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await fetchConsumerProfile(user!.id);

  return (
    <section className="scrollable-container flex w-full flex-col items-center gap-4 pb-4">
      <PerxHeader title="Edit profile" className="bg-white" />
      <ConsumerEditProfile profile={profile} />
    </section>
  );
}
