import MerchantScanner from '@/components/merchant/MerchantScanner';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan QR',
};

export default function ScanQR() {
  return (
    <div className="size-full">
      <MerchantScanner />
    </div>
  );
}
