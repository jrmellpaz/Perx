import { logoutMerchant } from '@/actions/merchant/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/merchant/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {data.user.email}</p>
      <form action={logoutMerchant}>
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
}
