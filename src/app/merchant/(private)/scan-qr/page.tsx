import { PerxLogoHeader } from '@/components/custom/PerxHeader';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';
import MerchantScanner from '@/components/merchant/MerchantScanner';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan QR',
};

export default function ScanQR() {
  return (
    <>
      <PerxLogoHeader>
        <MerchantLogo
          logoClass="text-xl pb-1.5"
          sublogoClass="text-md pb-0.5"
        />
      </PerxLogoHeader>
      <div className="size-full">
        <MerchantScanner />
      </div>
    </>
  );
}
