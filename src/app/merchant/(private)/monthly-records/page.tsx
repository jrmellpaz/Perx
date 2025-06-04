import PerxHeader from '@/components/custom/PerxHeader';
import { DashboardRecordsList } from '@/components/merchant/DashboardRecordsList';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TransactionRecords() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/merchant/login');
  }

  return (
    <>
      <PerxHeader title="Transaction records" className="bg-white shadow-md" />
      <DashboardRecordsList />
    </>
  );
}
