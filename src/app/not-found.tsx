import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function NotFound() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  let url: string;
  let userRole: 'merchant' | 'consumer' | undefined;
  if (!userData) {
    url = '/';
  } else {
    const { data: roleData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userData.user?.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    userRole = roleData.role;
    if (userRole === 'merchant') {
      url = '/merchant/dashboard';
    } else if (userRole === 'consumer') {
      url = '/explore';
    } else {
      throw new Error('MIDDLEWARE: Invalid user role');
    }
  }

  return (
    <section className="flex h-dvh w-dvw flex-col items-center justify-center gap-8">
      <div className="h-12 w-auto">
        <ConsumerLogo logoClass="text-4xl font-extrabold" />
      </div>
      <h1>
        <strong>ERROR 404:&nbsp;</strong>Page could not be found 😵
      </h1>
      <Link href={url}>
        <Button>
          Return to {userRole === 'merchant' ? `Dashboard` : `Home`}
        </Button>
      </Link>
    </section>
  );
}
