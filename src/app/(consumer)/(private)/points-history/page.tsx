import { createClient } from '@/utils/supabase/server';
import ConsumerPointHistory from '@/components/consumer/ConsumerPointHistory';
import PerxHeader from '@/components/custom/PerxHeader';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Points history',
};

export default async function PointsHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Error fetching user.');
  }

  return (
    <>
      <PerxHeader title="Points history" className="bg-white shadow-md" />
      <ConsumerPointHistory userId={user.id} />
    </>
  );
}
