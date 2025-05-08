import { MerchantCouponList } from '@/components/custom/MerchantCouponList';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CouponsTab() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/not-found');
  }

  return <MerchantCouponList userId={user.id} variant={'merchant'} />;
}
