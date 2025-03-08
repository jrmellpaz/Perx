import { getMerchantProfile } from '@/actions/merchant/profile';
import PerxTabs from '@/components/custom/PerxTabs';
import type { MerchantProfile } from '@/lib/merchant/profileSchema';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerchantProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/merchant/login');
  }

  const data = await getMerchantProfile(user.id);

  return (
    <section>
      <ProfileInfo data={data} />
      <PerxTabs />
    </section>
  );
}

function ProfileInfo({ data }: { data: MerchantProfile }) {
  return (
    <section>
      <div>
        <img
          src={data.logo}
          alt="Merchant Logo"
          className="aspect-square h-48 w-48 rounded-full object-cover"
        />
        <h3 className="text-3xl font-bold">{data.name}</h3>
        <p>{data.bio}</p>
        <p>{data.address}</p>
        <p>{data.email}</p>
      </div>
    </section>
  );
}
