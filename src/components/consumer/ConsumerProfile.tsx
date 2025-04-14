'use client';

import { CopyIcon, SparklesIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export function ReferralCard({
  referral_code,
  primary,
  secondary,
}: {
  referral_code: string;
  primary: string;
  secondary: string;
}) {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(referral_code);
    toast('Referral code copied to clipboard.');
  };

  return (
    <div className="bg-perx-white flex items-center gap-6 rounded-lg p-4 shadow-sm">
      <p className="aspect-square h-full w-auto shrink-0 text-6xl/[80px]">😎</p>
      <div className="flex grow flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <h3 className="font-mono font-medium">The more, the merrier!</h3>
          <div
            style={{ backgroundColor: `${secondary}33` }}
            className="flex items-center gap-1 rounded-full px-3 py-1"
          >
            <SparklesIcon style={{ color: primary }} size={12} />
            <p
              style={{ color: primary }}
              className="font-mono text-sm font-medium"
            >
              50
            </p>
          </div>
        </div>
        <p
          style={{ color: 'rgba(0, 0, 0, 0.8)' }} // Inline style for text color
          className="text-sm"
        >
          Share your referral code with friends! Earn 50 points for every friend
          who signs up using your code and makes their first coupon purchase.
        </p>
        <div
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.1)', // Inline style for border
            paddingTop: '8px',
          }}
          className="mt-2 flex items-center justify-between gap-4 px-2"
        >
          <h3
            style={{ color: primary }}
            className="text-xs sm:text-sm md:text-base"
          >
            {referral_code}
          </h3>
          <button
            onClick={handleCopy}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              color: primary,
              backgroundColor: isHovered ? `${secondary}33` : 'transparent',
            }}
            className="cursor-pointer rounded-full p-2.5 transition-all hover:bg-gray-100"
          >
            <CopyIcon size={14} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
