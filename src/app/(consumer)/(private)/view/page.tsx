import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';
import { PerxTicketSubmit } from '@/components/custom/PerxTicketSubmit';
import { fetchCoupon } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { fetchConsumerProfile } from '@/actions/consumerProfile';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';

import type { Consumer, Coupon, Merchant } from '@/lib/types';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const couponId = (await searchParams).coupon;
  const merchantId = (await searchParams).merchant;

  if (!couponId || !merchantId) {
    redirect('/not-found');
  }

  const coupon: Coupon = await fetchCoupon(couponId);
  const merchant: Merchant = await fetchMerchant(merchantId);

  return {
    title: coupon.title,
    description: coupon.description,
    keywords: [coupon.category, merchant.name, 'Perx', 'Coupon'],
    category: coupon.category,
    openGraph: {
      siteName: 'Perx',
      title: coupon.title,
      description: coupon.description,
      type: 'article',
      publishedTime: coupon.created_at,
      authors: [merchant.name],
      images: [
        {
          url: coupon.image,
          alt: `${coupon.title} banner`,
        },
      ],
    },
    twitter: {
      title: coupon.title,
      description: coupon.description,
      image: {
        url: coupon.image,
        alt: `${coupon.title} banner`,
      },
    },
  };
}

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const couponId = (await searchParams).coupon;
  const merchantId = (await searchParams).merchant;

  if (!couponId || !merchantId) {
    redirect('/not-found');
  }

  const coupon: Coupon = await fetchCoupon(couponId);
  const merchant: Merchant = await fetchMerchant(merchantId);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let consumerData: Consumer | null = null;
  let rankAchieved: boolean = true;

  if (user !== null && user.user_metadata.role === 'consumer') {
    consumerData = await fetchConsumerProfile(user.id);
    rankAchieved = consumerData.rank >= coupon.rank_availability;
  }

  return (
    <section
      className="view-container flex h-full w-full flex-col items-center overflow-y-auto bg-transparent"
      style={{ backgroundColor: getPrimaryAccentColor(coupon.accent_color) }}
    >
      <PerxHeader
        title=""
        className="text-white"
        style={{
          backgroundColor: getPrimaryAccentColor(coupon.accent_color),
        }}
        buttonStyle={{
          backgroundColor: getPrimaryAccentColor(coupon.accent_color),
        }}
      />
      <div className="mb-8 flex w-full grow items-center justify-center">
        <PerxTicket
          couponData={coupon}
          merchantData={merchant}
          variant="consumer"
        ></PerxTicket>
      </div>
      <div
        className="custom-shadow sticky bottom-0 box-border w-full max-w-[800px] p-3 md:bottom-4 md:mx-auto md:w-[95%] md:rounded-lg md:p-4"
        style={{ backgroundColor: getAccentColor(coupon.accent_color) }}
      >
        <PerxTicketSubmit coupon={coupon} disabledByRank={!rankAchieved}>
          {!rankAchieved && (
            <div
              className="mb-2 flex w-full items-center gap-1 text-xs"
              style={{ color: getPrimaryAccentColor(coupon.accent_color) }}
            >
              <InfoIcon size={14} />
              <span>You don't have enough Rank to purchase this coupon.</span>
            </div>
          )}
        </PerxTicketSubmit>
      </div>
    </section>
  );
}
