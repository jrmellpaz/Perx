import { fetchCoupons } from '@/actions/coupon';
import { PerxLogoHeader } from '@/components/custom/PerxHeader';
import { createClient } from '@/utils/supabase/server';
import { ExploreList } from '@/components/consumer/ExploreList';

export default async function Explore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const coupons = await fetchCoupons(user?.id);

  return (
    <>
      <PerxLogoHeader />
      <section className="w-full px-2 py-4 sm:px-4">
        <ExploreList userId={user?.id} />
      </section>
    </>
  );
}
