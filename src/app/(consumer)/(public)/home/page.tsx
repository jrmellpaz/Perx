import { logoutConsumer } from '@/actions/consumer/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type UserRole = 'consumer' | 'merchant';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const userRole: UserRole = user?.user_metadata.role as UserRole;

  return (
    <div>
      <h1>Home</h1>
      {userRole === 'merchant' ? (
        <Link href="/login">
          <Button variant="link">Login</Button>
        </Link>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          {/* <form action={logoutConsumer}>
            <Button type="submit">Log out</Button>
          </form> */}
        </>
      )}
    </div>
  );
}
