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
  const [loading, setLoading] = useState(false);

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
      await html5QrCodeRef.current?.clear();
    } catch (err) {
      console.warn('Failed to stop scanner:', err);
    } finally {
      html5QrCodeRef.current = null;
    }
  };

  const handleScan = async (decodedText: string) => {
    setQrToken(decodedText);
    setScanResult(`Scanned: ${decodedText}`);

    const coupon = await getCouponFromToken(decodedText);

    if (!coupon || 'success' in coupon) {
      toast.error((coupon as any)?.message || 'Coupon not found.');
      setCouponDetails(null);
      return;
    }

    setCouponDetails(coupon as Coupon);
  };

  const handleConfirmRedeem = async () => {
    if (!qrToken) return;
    setLoading(true);

    const confirm = window.confirm('Redeem this coupon?');
    if (!confirm) {
      setLoading(false);
      return;
    }

    const redeem = await redeemCoupon(qrToken);

    if (redeem.success) {
      toast.success(redeem.message);
      setCouponDetails(null);
      setScanResult('Coupon redeemed successfully.');
    } else {
      toast.error(redeem.message);
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
      {scannerActive && (
        <div id="reader" ref={scannerRef} className="w-full max-w-sm" />
      )}

      {scanResult && <p className="text-gray-700">{scanResult}</p>}

      {couponDetails && (
        <div className="w-full max-w-sm rounded border bg-white p-4 text-left shadow">
          <img
            src={couponDetails.image}
            alt={couponDetails.title}
            className="mb-2 h-40 w-full rounded object-cover"
          />
          <h3 className="text-lg font-bold">{couponDetails.title}</h3>
          <p className="text-sm text-gray-600">{couponDetails.description}</p>

          <button
            className="mt-4 w-full rounded bg-green-600 p-2 text-white"
            onClick={handleConfirmRedeem}
          >
            Confirm & Redeem
          </button>
        </div>
      )}

      {!scannerActive && (
        <button
          className="mt-4 w-full max-w-sm rounded bg-blue-600 p-2 text-white"
          onClick={handleScanAgain}
        >
          Scan Again
        </button>
      )}
    </div>
  );
}
