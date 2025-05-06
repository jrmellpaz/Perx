import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxTicket } from '@/components/custom/PerxTicket';
import { redirect } from 'next/navigation';
import { PerxTicketSubmit } from '@/components/custom/PerxTicketSubmit';
import { fetchCoupon, getQRCode } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { getPrimaryAccentColor } from '@/lib/utils';

import type { Coupon, Merchant } from '@/lib/types';

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

  const qrToken = await getQRCode(couponId) || '';
  console.log(qrToken);

  return (
    <section
      className="view-container flex h-full w-full flex-col items-center overflow-y-auto bg-transparent pb-14"
      style={{ backgroundColor: getPrimaryAccentColor(coupon.accent_color) }}
    >
      <PerxHeader
        title=""
        className="text-white"
        style={{ backgroundColor: getPrimaryAccentColor(coupon.accent_color) }}
        buttonStyle={{
          backgroundColor: getPrimaryAccentColor(coupon.accent_color),
        }}
      />
      <div className="flex w-full grow items-center justify-center">
        <PerxTicket
          couponData={coupon}
          merchantData={merchant}
          variant="consumer"
          {...(qrToken && { qrToken })}  // Conditionally pass qrToken if it exists
        >
          {qrToken ? (
            <PerxTicketSubmit coupon={coupon} qrToken={qrToken} />
          ) : (
            <PerxTicketSubmit coupon={coupon} />
          )}
        </PerxTicket>
      </div>
    </section>
  );
}
