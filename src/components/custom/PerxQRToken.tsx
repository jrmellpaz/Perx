'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import type { Coupon } from '@/lib/types';

export function PerxQRToken({ coupon, qrToken }: { coupon: Coupon; qrToken: string }) {
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
    <div className="flex justify-center items-center">
      <img src={qrImage} alt="Coupon QR Code" className="w-48 h-48" />
    </div>
  );
}


async function generateQRCodeImage(token: string): Promise<string> {
  return await QRCode.toDataURL(token); // returns base64 string
}