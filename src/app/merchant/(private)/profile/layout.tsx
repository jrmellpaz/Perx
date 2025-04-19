import { ReactNode } from 'react';
import { fetchMerchantProfile } from '@/actions/merchantProfile';
import Tabs from '@/components/custom/PerxTabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArchiveIcon,
  MailIcon,
  MapPinIcon,
  SettingsIcon,
  SquareLibraryIcon,
  TicketsIcon,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { PerxReadMore } from '@/components/custom/PerxReadMore';

import type { Merchant } from '@/lib/types';

export default async function MerchantProfileLayout({
  tabs,
}: {
  tabs: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const data = await fetchMerchantProfile(user!.id); // Fetch profile data

  const tabItems = [
    {
      name: 'Coupons',
      icon: <TicketsIcon size={20} />,
      path: '/merchant/profile/coupons',
    },
    {
      name: 'Collections',
      icon: <SquareLibraryIcon size={20} />,
      path: '/merchant/profile/collections',
    },
    {
      name: 'Archive',
      icon: <ArchiveIcon size={20} />,
      path: '/merchant/profile/archive',
    },
  ];

  return (
    <section className="flex flex-col lg:px-20">
      {/* Static profile details at the top */}
      <ProfileInfo data={data} />

      {/* Tab Navigation */}
      <div className="sticky top-0 z-50 w-full">
        <Tabs tabItems={tabItems} />
      </div>

      {/* Render dynamic content from the parallel routes */}
      <div>{tabs}</div>
    </section>
  );
}

function ProfileInfo({ data }: { data: Merchant }) {
  return (
    <section className="flex flex-col gap-4 pt-4 lg:flex-row">
      <div className="flex basis-1/4 items-center justify-center">
        <img
          src={data.logo}
          alt="Merchant Logo"
          className="aspect-square size-28 h-auto rounded-full border object-cover md:size-36"
        />
      </div>
      <div className="flex grow flex-col items-center justify-center gap-4 lg:items-start">
        <div className="flex items-center gap-8">
          <h3 className="font-mono text-xl font-bold tracking-tight lg:text-3xl">
            {data.name}
          </h3>
          <div className="hidden lg:flex">
            <ButtonGroup />
          </div>
        </div>
        <div className="lg:hidden">
          <ButtonGroup />
        </div>
        <div className="flex flex-col items-center gap-1 lg:items-start">
          <PerxReadMore id="merchant-bio" text={data.bio ?? ''} />
          <div className="flex items-center gap-1.5">
            <MapPinIcon size={15} />
            <p className="text-sm select-all">{data.address}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <MailIcon size={15} />
            <p className="text-sm select-all">{data.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ButtonGroup() {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <Link href="/merchant/edit-profile">
        <Button>Edit profile</Button>
      </Link>
      <Button variant={'secondary'}>Share profile</Button>
      <Link href="/merchant/settings">
        <Button variant={'secondary'}>
          <SettingsIcon />
        </Button>
      </Link>
    </div>
  );
}
