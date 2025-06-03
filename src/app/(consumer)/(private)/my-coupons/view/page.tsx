import { fetchMerchant } from '@/actions/merchantProfile';
import { redirect } from 'next/navigation';
import { fetchConsumerCoupon } from '@/actions/coupon';
import PerxHeader from '@/components/custom/PerxHeader';
import { cn, getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { PerxQRToken } from '@/components/custom/PerxQRToken';
import { ReactNode } from 'react';
import Link from 'next/link';
import { PerxReadMore } from '@/components/custom/PerxReadMore';
import CouponRedemptionListener from '@/components/consumer/CouponRedemptionListener';

import type { Merchant, ConsumerCoupon } from '@/lib/types';

interface CouponDetails {
  title: string;
  image: string;
  category: string;
  description: string;
  accent_color: string;
}

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const consumerCouponId = (await searchParams).coupon;

  if (!consumerCouponId) {
    redirect('/not-found');
  }

  const consumerCoupon: ConsumerCoupon = await fetchConsumerCoupon(
    consumerCouponId as unknown as number
  );
  const merchant: Merchant = await fetchMerchant(consumerCoupon.merchant_id);
  const couponDetails = consumerCoupon.details as unknown as CouponDetails;

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
        <PurchasedCoupon couponData={couponDetails} merchantData={merchant}>
          <div className="flex flex-col gap-4">
            <PerxQRToken qrToken={consumerCoupon.qr_token} />
            <CouponRedemptionListener consumerCouponId={consumerCoupon.id} />
          </div>
        </PurchasedCoupon>
      </div>
    </section>
  );
}

function PurchasedCoupon({
  couponData,
  merchantData,
  children,
}: {
  couponData: CouponDetails;
  merchantData: Merchant;
  children?: ReactNode;
}) {
  const { title, description, image, category, accent_color } = couponData;

  return (
    <div
      className={cn(
        `relative flex w-[90%] flex-col rounded-lg shadow-xl sm:w-[60%] sm:max-w-[480px]`
      )}
      style={{ backgroundColor: getAccentColor(accent_color) }}
    >
      <div className="flex flex-col items-center">
        <div className="h-auto w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="aspect-video h-auto w-full mask-b-from-80% object-cover"
          />
        </div>
        <div className="flex w-full flex-col gap-4 px-6 pt-2 pb-4">
          <div className="flex flex-col gap-1.5">
            <h2
              style={{ color: getPrimaryAccentColor(accent_color) }}
              className="font-mono text-lg/tight font-black tracking-tight"
            >
              {title}
            </h2>
            <Link href={`/merchant-profile/${merchantData.id}/coupons`}>
              <div className="flex items-center gap-1.5">
                <img
                  src={merchantData.logo}
                  alt="Merchant icon"
                  className="size-4 rounded-full border"
                />
                <p className="text-perx-black text-xs">{merchantData.name}</p>
              </div>
            </Link>
            <span className="border-perx-black text-perx-black w-fit rounded-full border px-1.5 py-0.5 text-xs/tight tracking-tight">
              {category}
            </span>
          </div>
          {/* Always show the "About this coupon" section */}
          <div className="flex flex-col">
            <h3
              style={{ color: getPrimaryAccentColor(accent_color) }}
              className="font-mono text-xs font-medium tracking-tight"
            >
              About this coupon
            </h3>
            <PerxReadMore
              id="coupon-description"
              accentColor={accent_color}
              text={description}
            />
          </div>
        </div>
      </div>
      {/* Broken Line Divider */}
      <div className="relative flex items-center">
        <div
          style={{ borderColor: getPrimaryAccentColor(accent_color) }}
          className="w-full border-t border-dashed"
        ></div>
        {/* Left Circular Div */}
        <div
          style={{ backgroundColor: getPrimaryAccentColor(accent_color) }}
          className={`inset-right absolute -left-3 size-6 rounded-full`}
        ></div>
        {/* Right Circular Div */}
        <div
          style={{ backgroundColor: getPrimaryAccentColor(accent_color) }}
          className={`inset-left absolute -right-3 size-6 rounded-full`}
        ></div>
      </div>
      {/* Lower Half */}
      <div className="flex flex-col gap-4 p-6">
        {/* Price Section */}
        <div>{children}</div>
      </div>
    </div>
  );
}
