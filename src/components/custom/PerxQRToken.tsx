'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import type { Coupon } from '@/lib/types';

export function PerxQRToken({ qrToken }: { qrToken: string }) {
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      const img = await generateQRCodeImage(qrToken);
      setQrImage(img);
    }
    generate();
  }, [qrToken]);

  if (!qrImage) return <p>Loading QR...</p>;

  return (
    <div className="flex items-center justify-center">
      <img src={qrImage} alt="Coupon QR Code" className="size-48 rounded-lg" />
    </div>
  );
}

async function generateQRCodeImage(token: string): Promise<string> {
  return await QRCode.toDataURL(token); // returns base64 string
}
