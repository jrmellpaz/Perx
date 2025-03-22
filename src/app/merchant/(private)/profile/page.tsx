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

  const data = await getMerchantProfile(user!.id);
  const coupons = await getMerchantCoupons(user!.id);

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
    <section className="flex flex-col gap-6 overflow-x-hidden lg:px-20">
      <ProfileInfo data={data} />
      <PerxTabs tabItems={profileNavItems} />
    </section>
  );
}

function ProfileInfo({ data }: { data: MerchantProfile }) {
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
          <h3 className="text-xl font-bold lg:text-3xl">{data.name}</h3>
          <div className="hidden lg:flex">
            <ButtonGroup />
          </div>
        </div>
        <div className="lg:hidden">
          <ButtonGroup />
        </div>
        <div className="flex flex-col items-center gap-1 lg:items-start">
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

function CouponList({ coupons }: { coupons: MerchantCoupon[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:px-8 md:gap-4">
      {coupons.map((coupon, index) => (
        <div
          key={coupon.id}
          className={`flex grow basis-60 flex-col gap-2 overflow-hidden rounded-md border pb-2`}
        >
          <div className="coupon-image aspect-square h-auto w-full">
            <img
              src={coupon.image}
              alt={`${coupon.title} coupon`}
              className="aspect-square h-full w-full rounded-sm object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 px-2 py-1">
            <p className="text-sm font-medium sm:text-base">{coupon.title}</p>
            {
              //TODO: Add coupon type
            }
          </div>
        </div>
      ))}
    </div>
  );
}
