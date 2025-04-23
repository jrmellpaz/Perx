'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import type { Coupon, SuccessResponse } from '@/lib/types';

export const purchaseCoupon = async (
  coupon: Coupon,
  paymentMethod: 'cash' | 'points'
): Promise<SuccessResponse> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    const { data: consumer, error: consumerError } = await supabase
      .from('consumers')
      .select('rank')
      .eq('id', user.id)
      .single();

    if (consumerError || !consumer) {
      throw new Error('Unable to fetch consumer data.');
    }

    if (consumer.rank < coupon.rankAvailability) {
      console.log('here');
      return { success: false, message: `Heads up! This reward unlocks at a higher rank. A few more steps and it's yours! 🚀` };
    }

    if (paymentMethod === 'points' && coupon.quantity > 0) {
      const result = await handlePointsPurchase(user.id, coupon.pointsAmount);
      if (!result.success) {
        return { success: false, message: result.message };
      }
    } else if (coupon.quantity > 0) {
      const result = await handleCashPurchase(user.id, coupon.price);
      if (!result.success) {
        return { success: false, message: result.message };
      }
    } else {
      return { success: false, message: 'Coupon is out of stock.' };
    }

    const { error: insertUserCouponError } = await supabase
      .from('user_coupons')
      .insert({
        couponId: coupon.id,
        consumerId: user.id,
      });

    if (insertUserCouponError) {
      throw new Error(
        `Error inserting user coupon: ${insertUserCouponError.message}`
      );
    }

    const { error: updateCouponError } = await supabase
      .from('coupons')
      .update({ quantity: coupon.quantity - 1 })
      .eq('id', coupon.id);
    
    if (updateCouponError) {
      throw new Error(
        `Error updating coupon: ${updateCouponError.message}`
      );
    }

    return { success: true, message: 'Coupon purchased successfully!' };
  } catch (error) {
    console.error('Error purchasing coupon:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const handleCashPurchase = async (
  consumerId: string,
  amount: number
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: consumer, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (fetchConsumerError) {
      throw new Error(`Error fetching consumer: ${fetchConsumerError.message}`);
    }

    const rebatePoints: number = Math.round(amount * 0.01 * 100) / 100;
    const { error: updateRebateError } = await supabase
      .from('consumers')
      .update({
        pointsBalance: consumer.pointsBalance + rebatePoints,
        pointsTotal: consumer.pointsTotal + rebatePoints,
      })
      .eq('id', consumerId);

    if (updateRebateError) {
      throw new Error(
        `Error updating consumer points balance after rebate: ${updateRebateError.message}`
      );
    }

    if (!consumer.purchased) {
      const { error: updateError } = await supabase
        .from('consumers')
        .update({ 'purchased': true })
        .eq('id', consumerId);

      if (updateError) {
        console.error('Error updating hasPurchased:', updateError.message);
      }

      if (consumer.referrerCode) {
        rewardReferrer(consumer.referrerCode);
      }
    }
    return { success: true, message: 'Cash purchase successful!' };
  } catch (error) {
    console.error(`Error purchasing coupon: ${error}`);
    return { success: false, message: (error as Error).message };
  }
};

export const handlePointsPurchase = async (
  consumerId: string,
  pointsAmount: number | null
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: consumer, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (fetchConsumerError) {
      throw new Error(`Error fetching consumer: ${fetchConsumerError.message}`);
    }

    if (pointsAmount === null || consumer.pointsBalance < pointsAmount) {
      return { success: false, message: 'Insufficient points balance' };
    }

    const newPointsBalance: number = consumer.pointsBalance - pointsAmount;
    const { error: updateConsumerError } = await supabase
      .from('consumers')
      .update({ pointsBalance: newPointsBalance })
      .eq('id', consumerId);

    if (updateConsumerError) {
      throw new Error(
        `Error updating consumer points balance: ${updateConsumerError.message}`
      );
    }

    if (!consumer.purchased) {
      await supabase
        .from('consumers')
        .update({ purchased: true })
        .eq('id', consumerId);

      // Reward referrer
      if (consumer.referrerCode) {
        rewardReferrer(consumer.referrerCode);
      }
    }

    return { success: true, message: 'Coupon purchased successfully!' };
  } catch (error) {
    console.error(`Error purchasing coupon: ${error}`);
    return { success: false, message: (error as Error).message };
  }
};

const rewardReferrer = async (referrerId: string): Promise<void> => {
  const supabase = await createClient();
  const { data: referrer, error: fetchReferrerError } = await supabase
    .from('consumers')
    .select('*')
    .eq('referralCode', referrerId)
    .single();

  if (fetchReferrerError) {
    throw new Error(`Error fetching referrer: ${fetchReferrerError.message}`);
  }

  const REWARD: number = 50;
  const newReferrerPointsBalance: number = referrer.pointsBalance + REWARD;

  const { error: updateReferrerError } = await supabase
    .from('consumers')
    .update({
      pointsBalance: newReferrerPointsBalance,
      pointsTotal: referrer.pointsTotal + REWARD,
    })
    .eq('id', referrer.id);

  if (updateReferrerError) {
    throw new Error(
      `Error updating referrer points balance: ${updateReferrerError.message}`
    );
  }
};
