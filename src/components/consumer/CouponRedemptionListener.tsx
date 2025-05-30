'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';


export default function CouponRedemptionListener({ consumerCouponId }: { consumerCouponId: number }) {
  const router = useRouter();
  const supabase = createClient();  useEffect(() => { 
    const channel = supabase
      .channel('consumer-coupon-listener')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'consumer_coupons',
          filter: `id=eq.${consumerCouponId}`,
        },
        (payload) => {            
          const updatedCoupon = payload.new;         
          if (updatedCoupon.is_redeemed) {
            router.push('/my-coupons');
          }
        }
      )      
    .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };  }, [consumerCouponId, router]);
  
  return null;
}
