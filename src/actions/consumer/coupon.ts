'use server';

import { ConsumerCoupon, PurchasedCoupon } from '@/lib/consumer/couponSchema';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { handlePurchase } from './achievements';

export async function getCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select(
      'id, description, price, allow_limited_purchase, valid_from, valid_to, is_deactivated, image, title, quantity, category, accent_color, rank_availability, allow_points_purchase, points_amount, merchant:merchants(id, name, logo)'
    )
    .order('created_at', { ascending: false });

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
    rankAvailability: coupon.rank_availability.toString(),
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
  if (paymentMethod === 'points') {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('points_amount')
      .eq('id', couponId)
      .single();
    handlePurchase(consumerId, coupon?.points_amount ?? undefined); // Call the function to handle points deduction
  }
  handlePurchase(consumerId); // Call the function to handle points purchase
  // TODO: Update loyalty points
}

export async function fetchConsumerCoupons(): Promise<ConsumerCoupon[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const consumerId = userData.user?.id;

  if (!consumerId) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('user_coupons')
    .select('id, created_at, consumer_id, coupon_id, coupons(*, merchants(*))')
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching joined data:', error);
    return [];
  }

  console.log('Fetched consumer coupons:', data);

  // Map the joined data to match the PurchasedCoupon type
  const consumerCoupons: ConsumerCoupon[] = data.map((entry) => {
    const coupon = Array.isArray(entry.coupons)
      ? entry.coupons[0]
      : entry.coupons;

    return {
      id: coupon.id, // ID from the coupons table
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
      rankAvailability: coupon.rank_availability.toString(),
      allowPointsPurchase: coupon.allow_points_purchase,
      pointsAmount: coupon.points_amount,
      merchant: {
        id: coupon.merchant_id,
        name: coupon.merchants.name,
        logo: coupon.merchants.logo,
      },
    };
  });

  return consumerCoupons;
}
