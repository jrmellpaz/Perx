import { fetchRank } from '@/actions/rank';
import { MerchantProfile } from '@/lib/merchant/profileSchema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PerxReadMore } from './PerxReadMore';
import { SparklesIcon } from 'lucide-react';
import { PerxTicketSubmit } from './PerxTicketSubmit';

import type { Coupon } from '@/lib/types';

export async function PerxTicket({
  couponData,
  merchantData,
  variant,
}: {
  couponData: Coupon;
  merchantData: MerchantProfile;
  variant: 'consumer' | 'merchant';
}) {
  const {
    id: couponId,
    title,
    description,
    price,
    allowLimitedPurchase,
    validFrom = '',
    validTo = '',
    isDeactivated,
    image,
    quantity,
    category,
    accentColor,
    rankAvailability,
    allowPointsPurchase,
    pointsAmount,
  } = couponData;

  const { rank, icon } = await fetchRank(rankAvailability);

  return (
    <section
      style={{ backgroundColor: getPrimaryAccentColor(accentColor) }}
      className={`flex h-full w-full items-center justify-center overflow-y-auto py-4`}
    >
      <div
        className={cn(
          `relative mt-4 flex w-[90%] flex-col rounded-lg shadow-xl sm:w-[60%] sm:max-w-[480px]`
        )}
        style={{ backgroundColor: getAccentColor(accentColor) }}
      >
        <div className="flex flex-col items-center">
          <div className="h-auto w-full overflow-hidden rounded-t-lg">
            <img
              src={image || undefined}
              alt={title}
              className="aspect-video h-auto w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-4 px-6 py-4">
            <div className="flex flex-col gap-1.5">
              <h2
                style={{ color: getPrimaryAccentColor(accentColor) }}
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
                <Link href="#">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={merchantData.logo}
                      alt="Merchant icon"
                      className="size-4 rounded-full border"
                    />
                    <p className="text-perx-black text-xs">
                      {merchantData.name}
                    </p>
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
                  style={{ color: getPrimaryAccentColor(accentColor) }}
                  className={`font-mono text-sm font-medium tracking-tight`}
                >
                  {quantity}
                </h3>
                <p className="text-perx-black text-xs tracking-tight">
                  Items left
                </p>
              </div>
              {allowLimitedPurchase && (
                <>
                  <div className="border-muted-foreground mx-3 h-6 w-[0.25px] rounded-full border-l-[0.5px]"></div>
                  <div className="flex shrink-0 flex-col items-center">
                    <h3
                      style={{ color: getPrimaryAccentColor(accentColor) }}
                      className={`font-mono text-sm font-medium tracking-tight`}
                    >
                      {formatDate(validFrom)} - {formatDate(validTo)}
                    </h3>
                    {/* <CountdownTimer validTo={validTo} /> */}
                    <p className="text-perx-black text-xs tracking-tight">
                      Validity
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
                style={{ color: getPrimaryAccentColor(accentColor) }}
                className="font-mono text-xs font-medium tracking-tight"
              >
                About this coupon
              </h3>
              <PerxReadMore
                id="coupon-description"
                accentColor={accentColor}
                text={description}
              />
            </div>
          </div>
        </div>
        {/* Broken Line Divider */}
        <div className="relative flex items-center">
          <div
            style={{ borderColor: getPrimaryAccentColor(accentColor) }}
            className="w-full border-t border-dashed"
          ></div>
          {/* Left Circular Div */}
          <div
            style={{ backgroundColor: getPrimaryAccentColor(accentColor) }}
            className={`inset-right absolute -left-3 size-6 rounded-full`}
          ></div>
          {/* Right Circular Div */}
          <div
            style={{ backgroundColor: getPrimaryAccentColor(accentColor) }}
            className={`inset-left absolute -right-3 size-6 rounded-full`}
          ></div>
        </div>
        {/* Lower Half */}
        <div className="flex flex-col gap-4 p-6">
          {/* Price Section */}
          <div className="flex flex-col items-center gap-2">
            <span
              style={{ color: getPrimaryAccentColor(accentColor) }}
              className="font-mono text-xl font-bold"
            >
              &#8369;{price.toFixed(2)}
            </span>
            {allowPointsPurchase && (
              <span className="flex items-center gap-2 text-sm text-gray-600">
                or <SparklesIcon size={20} className="" /> {pointsAmount} Points
              </span>
            )}
          </div>
          {variant === 'consumer' && (
            <PerxTicketSubmit
              allowPointsPurchase={allowPointsPurchase}
              accentColor={accentColor}
              coupon={couponData}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(date: string | null): string {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
}

export function getAccentColor(accentColor: string): string {
  const colors: Record<string, string> = {
    'perx-blue': '#b7d0f7',
    'perx-canopy': '#b9f0df',
    'perx-rust': '#fadac8',
    'perx-gold': '#eddfc5',
    'perx-azalea': '#f0c7db',
    'perx-navy': '#b6c7e3',
  };
  return colors[accentColor] || '#FFFFFF'; // Default to white if color is not found
}

export function getPrimaryAccentColor(accentColor: string): string {
  const primaryColors: Record<string, string> = {
    'perx-blue': '#0061FE',
    'perx-canopy': '#0F503C',
    'perx-rust': '#BE4B0A',
    'perx-gold': '#9B6400',
    'perx-azalea': '#CD2F7B',
    'perx-navy': '#283750',
  };

  return primaryColors[accentColor] || '#FFFFFF';
}
