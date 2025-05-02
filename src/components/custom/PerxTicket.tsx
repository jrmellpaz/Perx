import { fetchRank } from '@/actions/rank';
import { cn, getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import Link from 'next/link';
import { PerxReadMore } from './PerxReadMore';
import { ReactNode, Suspense } from 'react';
import { PerxCountdown } from './PerxCountdown';

import type { Coupon, Merchant } from '@/lib/types';

export async function PerxTicket({
  couponData,
  merchantData,
  variant,
  children,
}: {
  couponData: Coupon;
  merchantData: Merchant;
  variant: 'consumer' | 'merchant';
  children?: ReactNode;
}) {
  const {
    id: couponId,
    title,
    description,
    price,
    allow_limited_purchase,
    valid_from = '',
    valid_to = '',
    is_deactivated,
    image,
    quantity,
    category,
    accent_color,
    rank_availability,
    allow_points_purchase,
    points_amount,
  } = couponData;

  const { rank, icon } = await fetchRank(rank_availability);

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
            {variant === 'merchant' ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={merchantData.logo}
                  alt="Merchant icon"
                  className="size-5 rounded-full object-cover"
                />
                <p className="text-perx-black text-xs">{merchantData.name}</p>
              </div>
            ) : (
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
            )}
            <span className="border-perx-black text-perx-black w-fit rounded-full border px-1.5 py-0.5 text-xs/tight tracking-tight">
              {category}
            </span>
          </div>
          <div className="flex items-center overflow-y-auto">
            <div className="flex shrink-0 flex-col items-center">
              <h3
                style={{ color: getPrimaryAccentColor(accent_color) }}
                className={`font-mono text-sm font-medium tracking-tight`}
              >
                {quantity}
              </h3>
              <p className="text-perx-black text-xs tracking-tight">
                Items left
              </p>
            </div>
            {allow_limited_purchase && (
              <>
                <div className="border-muted-foreground mx-3 h-6 w-[0.25px] rounded-full border-l-[0.5px]"></div>
                <div className="flex shrink-0 flex-col items-center">
                  <Suspense fallback={<p>Loading...</p>}>
                    <PerxCountdown
                      targetDate={valid_to}
                      className="font-mono text-sm font-medium tracking-tight"
                      style={{ color: getPrimaryAccentColor(accent_color) }}
                    />
                  </Suspense>
                  <p className="text-perx-black text-xs tracking-tight">
                    Valid until {formatDate(valid_to)}
                  </p>
                </div>
              </>
            )}
            <div className="border-muted-foreground mx-3 h-6 w-[0.25px] rounded-full border-l-[0.5px]"></div>
            <div className="flex shrink-0 flex-col items-center">
              <img src={icon} alt="Rank icon" className="size-6" />
              <p className="text-perx-black text-xs tracking-tight">
                For {rank} and up
              </p>
            </div>
          </div>
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
        <div className="flex flex-col items-center gap-2">
          <span
            style={{ color: getPrimaryAccentColor(accent_color) }}
            className="font-mono text-xl font-bold"
          >
            &#8369;{price.toFixed(2)}
          </span>
          {allow_points_purchase && (
            <span className="text-perx-black flex items-center gap-1 text-sm tracking-tighter">
              or&nbsp;
              <img
                src="/reward-points.svg"
                alt="Reward Points"
                width={18}
                height={18}
                className="pb-0.25"
              />{' '}
              {points_amount} points
            </span>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function formatDate(date: string | null): string {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
}
