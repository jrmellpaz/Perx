import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';
import { PerxTicketSubmit } from '@/components/custom/PerxTicketSubmit';
import { fetchCoupon } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { getPrimaryAccentColor } from '@/lib/utils';

import type { Consumer, Coupon, Merchant } from '@/lib/types';
import { fetchConsumerProfile } from '@/actions/consumerProfile';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';

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

  if (user !== null) {
    consumerData = await fetchConsumerProfile(user.id);
    rankAchieved = consumerData.rank >= coupon.rank_availability;
  }

  return (
    <section
      className="view-container flex h-full w-full flex-col items-center overflow-y-auto bg-transparent pb-14"
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
      <div className="flex w-full grow items-center justify-center">
        <PerxTicket
          couponData={coupon}
          merchantData={merchant}
          variant="consumer"
        >
          {!rankAchieved && (
            <div
              className="mb-2 flex w-full items-center gap-1 text-xs"
              style={{ color: getPrimaryAccentColor(coupon.accent_color) }}
            >
              <InfoIcon size={14} />
              <span>You don't have enough Rank to purchase this coupon.</span>
            </div>
          )}
          <PerxTicketSubmit coupon={coupon} disabledByRank={!rankAchieved} />
        </PerxTicket>
      </div>
    </section>
  );
}
