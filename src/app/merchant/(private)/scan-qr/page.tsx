import MerchantScanner from '@/components/merchant/MerchantScanner';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan QR',
};

export default function ScanQR() {
  return (
    <div className="p-4">
      <MerchantScanner />
    </div>
  );
}
