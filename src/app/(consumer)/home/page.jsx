import { logoutConsumer } from '@/actions/consumer/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {data.user.email}</p>
      <form action={logoutConsumer}>
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
}
