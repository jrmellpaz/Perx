import { getMerchantProfile } from '@/actions/merchant/profile';
import PerxTabs from '@/components/custom/PerxTabs';
import { Button } from '@/components/ui/button';
import type { MerchantProfile } from '@/lib/merchant/profileSchema';
import { createClient } from '@/utils/supabase/server';
import {
  ArchiveIcon,
  SettingsIcon,
  SquareLibraryIcon,
  TicketsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { JSX } from 'react';

interface ProfileNavItems {
  icon: JSX.Element;
  name: string;
}

const profileNavItems: ProfileNavItems[] = [
  {
    name: 'Coupons',
    icon: <TicketsIcon size={16} aria-hidden="true" />,
  },
  {
    name: 'Collections',
    icon: <SquareLibraryIcon size={16} aria-hidden="true" />,
  },
  {
    name: 'Archive',
    icon: <ArchiveIcon size={16} aria-hidden="true" />,
  },
];

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
    <section className="flex flex-col gap-8 md:px-20">
      <ProfileInfo data={data} />
      <PerxTabs tabItems={profileNavItems} />
    </section>
  );
}

function ProfileInfo({ data }: { data: MerchantProfile }) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="flex basis-1/3 items-center justify-center">
        <img
          src={data.logo}
          alt="Merchant Logo"
          className="aspect-square size-32 rounded-full object-cover md:size-48"
        />
      </div>
      <div className="flex grow flex-col items-center justify-center gap-4 md:items-start">
        <div className="flex items-center gap-8">
          <h3 className="text-xl font-bold md:text-3xl">{data.name}</h3>
          <div className="hidden md:flex">
            <ButtonGroup />
          </div>
        </div>
        <div className="md:hidden">
          <ButtonGroup />
        </div>
        <div>
          <p className="text-sm">{data.bio}</p>
          <p className="text-sm">{data.address}</p>
          <p className="text-sm">{data.email}</p>
        </div>
      </div>
    </section>
  );
}

function ButtonGroup() {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <Button>Edit profile</Button>
      <Button variant={'secondary'}>Share profile</Button>
      <Link href="/merchant/settings">
        <Button variant={'secondary'}>
          <SettingsIcon />
        </Button>
      </Link>
    </div>
  );
}
