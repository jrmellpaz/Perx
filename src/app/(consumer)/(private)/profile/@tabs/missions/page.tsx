import { fetchConsumerProfile } from '@/actions/consumerProfile';
import { fetchRank } from '@/actions/rank';
import { ReferralCard } from '@/components/consumer/ConsumerProfile';
import { createClient } from '@/utils/supabase/server';

export default async function Missions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { referralCode, rank: rankId } = await fetchConsumerProfile(user!.id);
  const rank = await fetchRank(rankId);

  return (
    <section className="flex flex-col">
      <ReferralCard
        referral_code={referralCode}
        primary={rank.primaryColor}
        secondary={rank.secondaryColor}
      />
    </section>
  );
}
