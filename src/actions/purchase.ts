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
    // TODO: Implement payment processing logic here

    if (paymentMethod === 'points') {
      handlePointsPurchase(user.id, coupon.pointsAmount);
    } else {
      handleCashPurchase(user.id, coupon.price);
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
  return { success: true, message: 'Cash purchase successful!' };
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

    const rebatePoints: number = Math.round(pointsAmount * 0.01 * 100) / 100;
    const rebatedPointsBalance: number = newPointsBalance + rebatePoints;
    const { error: updateRebateError } = await supabase
      .from('consumers')
      .update({
        pointsBalance: rebatedPointsBalance,
        pointsTotal: consumer.pointsTotal + rebatePoints,
      })
      .eq('id', consumerId);

    if (updateRebateError) {
      throw new Error(
        `Error updating consumer points balance after rebate: ${updateRebateError.message}`
      );
    }

    if (!consumer.hasPurchased) {
      await supabase
        .from('consumers')
        .update({ hasPurchased: true })
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
