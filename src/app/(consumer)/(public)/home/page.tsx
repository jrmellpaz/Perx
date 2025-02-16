import { logoutConsumer } from '@/actions/consumer/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type UserRole = 'consumer' | 'merchant';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  const { data: roleData, error: errorData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  const userRole: UserRole = roleData?.role;

  if (errorData) {
    throw new Error(errorData.message);
  }

  return (
    <div>
      <h1>Home</h1>
      {userRole === 'merchant' ? (
        <Link href="/login">
          <Button variant="link">Login</Button>
        </Link>
      ) : (
        <>
          <p>Welcome, {data.user.email}</p>
          <form action={logoutConsumer}>
            <Button type="submit">Log out</Button>
          </form>
        </>
      )}
    </div>
  );
}
