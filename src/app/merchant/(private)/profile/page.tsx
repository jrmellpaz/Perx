import { getMerchantCoupons } from '@/actions/merchant/coupon';
import { getMerchantProfile } from '@/actions/merchant/profile';
import PerxTabs from '@/components/custom/PerxTabs';
import { Button } from '@/components/ui/button';
import { MerchantCoupon } from '@/lib/merchant/couponSchema';
import type { MerchantProfile } from '@/lib/merchant/profileSchema';
import { createClient } from '@/utils/supabase/server';
import {
  ArchiveIcon,
  MailIcon,
  MapPinIcon,
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
  content?: JSX.Element;
}

export default async function MerchantProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/merchant/login');
  }

  const data = await getMerchantProfile(user.id);
  const coupons = await getMerchantCoupons(user.id);

  const profileNavItems: ProfileNavItems[] = [
    {
      name: 'Coupons',
      icon: <TicketsIcon size={20} aria-hidden="true" />,
      content: <CouponList coupons={coupons} />,
    },
    {
      name: 'Collections',
      icon: <SquareLibraryIcon size={20} aria-hidden="true" />,
    },
    {
      name: 'Archive',
      icon: <ArchiveIcon size={20} aria-hidden="true" />,
    },
  ];

  return (
    <section className="flex flex-col gap-6 md:px-20">
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
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="text-sm">{data.bio}</p>
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

function CouponList({ coupons }: { coupons: MerchantCoupon[] }) {
  return (
    <div className="flex w-full flex-col gap-4 sm:px-8">
      {coupons.map((coupon, index) => (
        <div
          key={coupon.id}
          className={`flex gap-4 pb-4 ${index !== coupons.length - 1 && 'border-b'}`}
        >
          <img
            src={coupon.image}
            alt={`${coupon.title} coupon`}
            className="aspect-square size-20 rounded-sm object-cover md:size-28"
          />
          <div>
            <p>{coupon.title}</p>
            <p>{coupon.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
