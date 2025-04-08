'use server';

import { ConsumerCoupon } from '@/lib/consumer/couponSchema';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select(
      'id, description, price, allow_limited_purchase, valid_from, valid_to, is_deactivated, image, title, quantity, category, accent_color, rank_availability, allow_points_purchase, points_amount, merchant:merchants(id, name, logo)'
    );

  if (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }

  return data.map((coupon) => ({
    id: coupon.id,
    description: coupon.description,
    price: coupon.price,
    allowLimitedPurchase: coupon.allow_limited_purchase,
    validFrom: coupon.valid_from,
    validTo: coupon.valid_to,
    isDeactivated: coupon.is_deactivated,
    image: coupon.image,
    title: coupon.title,
    quantity: coupon.quantity,
    category: coupon.category,
    accentColor: coupon.accent_color,
    consumerAvailability: coupon.rank_availability,
    allowPointsPurchase: coupon.allow_points_purchase,
    pointsAmount: coupon.points_amount,
    merchant: Array.isArray(coupon.merchant)
      ? coupon.merchant[0]
      : coupon.merchant,
  })) as ConsumerCoupon[];
}

export async function purchaseCoupon(
  couponId: string,
  paymentMethod: 'points' | 'cash'
) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const consumerId = userData.user?.id;

  if (!couponId || !consumerId) {
    redirect('/login');
  }

  // TODO: Implement payment processing logic here
  // For now, we'll just simulate a successful purchase

  const { data, error: insertError } = await supabase
    .from('user_coupons')
    .insert({
      coupon_id: couponId,
      consumer_id: consumerId,
    });

  if (insertError) {
    console.error('Error purchasing coupon:', insertError);
  }

  // TODO: Update loyalty points
}
