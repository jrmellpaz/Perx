'use client';

import { useEffect, useState, useRef } from 'react';
import Quagga from '@ericblade/quagga2';
import { fetchCoupon, redeemCoupon } from '@/actions/coupon';
import type { Coupon } from '@/lib/types';

type ScannedCoupon = {
  coupon: Coupon;
  user_coupon_id: string;
};

export default function ScanCoupon() {
  const [scanned, setScanned] = useState<ScannedCoupon | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['code_128_reader'], // CODE128 barcodes only
        },
      },
      (err) => {
        if (err) {
          console.error('Quagga init error:', err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(async (data) => {
      const token = data.codeResult.code!;
      console.log('Barcode detected:', token);
      Quagga.stop(); // Stop scanning after detection

      const result = await fetchCoupon(token);
      if (!result) {
        alert('Invalid or already used coupon');
        return;
      }

      setScanned({
        coupon: result,
        user_coupon_id: result.id,
      });
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected(() => {});
    };
  }, []);

  async function handleRedeem() {
    if (!scanned) return;
    const res = await redeemCoupon(scanned.user_coupon_id);
    if (res.success) {
      alert('Coupon redeemed!');
      setScanned(null);
      Quagga.start(); // restart scanner
    } else {
      alert('Failed to redeem');
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      {!scanned ? (
        <div className="w-full max-w-[600px] mb-4 h-[300px]">
          <div ref={scannerRef} className="w-full" />
          {/* <p className="text-center mt-2">Point the barcode at your camera</p> */}
        </div>
      ) : (
        <div className="p-4 border rounded shadow mb-4">
          <h2 className="text-xl font-bold mb-2">{scanned.coupon.title}</h2>
          <p>{scanned.coupon.description}</p>
          <button
            onClick={handleRedeem}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Redeem
          </button>
        </div>
      )}
    </div>
  );
}
