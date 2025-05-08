import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';
import { fetchConsumerCoupon } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { getPrimaryAccentColor } from '@/lib/utils';
import { PerxQRToken } from '@/components/custom/PerxQRToken';

import type { Coupon, Merchant, UserCoupon } from '@/lib/types';

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const consumerCouponId = (await searchParams).coupon;

  if (!consumerCouponId) {
    redirect('/not-found');
  }

  const consumerCoupon: UserCoupon = await fetchConsumerCoupon(
    consumerCouponId as unknown as number
  );
  const couponDetails: Coupon = consumerCoupon.coupons;
  const merchant: Merchant = await fetchMerchant(couponDetails.merchant_id);

  return (
    <section
      className="view-container flex h-full w-full flex-col items-center overflow-y-auto bg-transparent pb-14"
      style={{
        backgroundColor: getPrimaryAccentColor(couponDetails.accent_color),
      }}
    >
      <PerxHeader
        title=""
        className="text-white"
        style={{
          backgroundColor: getPrimaryAccentColor(couponDetails.accent_color),
        }}
        buttonStyle={{
          backgroundColor: getPrimaryAccentColor(couponDetails.accent_color),
        }}
      />
      <div className="flex w-full grow items-center justify-center">
        <PerxTicket
          couponData={couponDetails}
          merchantData={merchant}
          variant="consumer"
        >
          <PerxQRToken
            coupon={couponDetails}
            qrToken={consumerCoupon.qr_token}
          />
        </PerxTicket>
      </div>
    </section>
  );
}
