import { ArchivedCouponList } from '@/components/merchant/ArchivedCouponList';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// app/merchant/profile/@tabs/archive/page.tsx
export default async function ArchiveTab() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/not-found');
  }
  return <ArchivedCouponList userId={user.id} />;
}
