import { ReactNode } from 'react';
import { fetchMerchant } from '@/actions/merchantProfile';
import Tabs from '@/components/custom/PerxTabs';
import {
  MailIcon,
  MapPinIcon,
  SquareLibraryIcon,
  TicketsIcon,
} from 'lucide-react';
import { PerxReadMore } from '@/components/custom/PerxReadMore';
import { ShareMerchantButton } from '@/components/custom/ShareMerchantButton';
import PerxHeader from '@/components/custom/PerxHeader';

import type { Merchant } from '@/lib/types';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = await params;
  const merchant = await fetchMerchant(merchantId);

  return {
    title: merchant.name,
    description: merchant.bio,
    keywords: [merchant.name, 'Perx', 'Merchant'],
    category: 'Merchant Profile',
    openGraph: {
      siteName: 'Perx',
      title: merchant.name,
      description: merchant.bio,
      type: 'profile',
      images: [
        {
          url: merchant.logo,
          alt: `${merchant.name} logo`,
        },
      ],
    },
    twitter: {
      title: merchant.name,
      description: merchant.bio,
      image: {
        url: merchant.logo,
        alt: `${merchant.name} logo`,
      },
    },
  };
}

export default async function MerchantProfileLayout({
  tabs,
  params,
}: {
  tabs: ReactNode;
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = await params;
  const data = await fetchMerchant(merchantId);
  const tabItems = [
    {
      name: 'Coupons',
      icon: <TicketsIcon size={20} />,
      path: `/merchant-profile/${merchantId}/coupons`,
    },
    {
      name: 'Collections',
      icon: <SquareLibraryIcon size={20} />,
      path: `/merchant-profile/${merchantId}/collections`,
    },
  ];

  return (
    <>
      <PerxHeader className="sticky top-0 z-50 bg-white shadow-md" />
      <section className="flex flex-col bg-inherit lg:px-20">
        {/* Static profile details at the top */}
        <ProfileInfo data={data} />

        {/* Tab Navigation */}
        <div className="sticky top-15.25 z-40 w-full bg-inherit">
          <Tabs tabItems={tabItems} />
        </div>

        {/* Render dynamic content from the parallel routes */}
        <div>{tabs}</div>
      </section>
    </>
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
            <ButtonGroup data={data} />
          </div>
        </div>
        <div className="lg:hidden">
          <ButtonGroup data={data} />
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

function ButtonGroup({ data }: { data: Merchant }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <ShareMerchantButton data={data} />
    </div>
  );
}
