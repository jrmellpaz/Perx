'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

import type { Coupon } from '@/lib/types';

export function PerxBarcodeToken({ coupon, qrToken }: { coupon: Coupon; qrToken: string }) {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, qrToken, {
        format: 'CODE128', // Common format
        lineColor: '#000',
        width: 2,
        height: 100,
        displayValue: true,
      });
    }
  }, [qrToken]);

  return (
    <div className="flex justify-center items-center">
      <svg ref={barcodeRef} className="w-full h-auto" />
    </div>
  );
}
