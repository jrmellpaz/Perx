'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

import { redeemCoupon, getCouponFromToken } from '@/actions/coupon';
import type { Coupon } from '@/lib/types';

export default function QRScannerClient() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [couponDetails, setCouponDetails] = useState<Coupon | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState<boolean>(true);

  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (scannerActive) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scannerActive]);

  const startScanner = async () => {
    // Only initialize if the scanner is not already active
    if (!scannerRef.current || html5QrCodeRef.current) return;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const qrCodeScanner = new Html5Qrcode(scannerRef.current.id);
    html5QrCodeRef.current = qrCodeScanner;

    try {
      await qrCodeScanner.start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          await handleScan(decodedText);
          stopScanner(); // Stop scanner after scan
        },
        (errorMessage) => {
          console.warn('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      console.error('Scanner start failed:', err);
    }
  };

  const stopScanner = async () => {
    try {
      await html5QrCodeRef.current?.stop();
    } catch (err) {
      console.warn('Failed to stop scanner:', err);
    }
  };

  const handleScan = async (decodedText: string) => {
    setQrToken(decodedText);
    setScanResult(`Scanned: ${decodedText}`);

    const res = await getCouponFromToken(decodedText);

    if (!res.success || !res.coupon) {
      toast.error(res.message || 'Coupon not found.');
      setCouponDetails(null);
      return;
    }

    setCouponDetails(res.coupon);
  };

  const handleConfirmRedeem = async () => {
    if (!qrToken) return;

    const confirm = window.confirm('Redeem this coupon?');
    if (!confirm) return;

    const res = await redeemCoupon(qrToken);

    if (res.success) {
      toast.success(res.message);
      setCouponDetails(null);
      setScanResult('Coupon redeemed successfully.');
    } else {
      toast.error(res.message);
    }

    setQrToken(null);
    setScannerActive(false); // Ensure stopped after redeem
  };

  const handleScanAgain = () => {
    setCouponDetails(null);
    setScanResult(null);
    setQrToken(null);
    setScannerActive(true); // Restart scanner
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {scannerActive && <div id="reader" ref={scannerRef} className="w-full max-w-sm" />}

      {scanResult && <p className="text-gray-700">{scanResult}</p>}

      {couponDetails && (
        <div className="w-full max-w-sm p-4 border rounded shadow bg-white text-left">
          <img
            src={couponDetails.image}
            alt={couponDetails.title}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h3 className="text-lg font-bold">{couponDetails.title}</h3>
          <p className="text-sm text-gray-600">{couponDetails.description}</p>
          {/* <p className="text-sm text-gray-500">{couponDetails.merchant_name}</p> */}

          <button
            className="mt-4 w-full bg-green-600 text-white p-2 rounded"
            onClick={handleConfirmRedeem}
          >
            Confirm & Redeem
          </button>
        </div>
      )}

      {!scannerActive && (
        <button
          className="mt-4 w-full max-w-sm bg-blue-600 text-white p-2 rounded"
          onClick={handleScanAgain}
        >
          Scan Again
        </button>
      )}
    </div>
  );
}
