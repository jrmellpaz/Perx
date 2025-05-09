'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import type { Coupon, SuccessResponse } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { createOrder, createPayment } from './paypal';

// TODO: Disable buttons if rank is lower than coupon.rank_availability
// TODO: Add loading state to buttons
// TODO: Not show coupons with quantity 0 in the list

export const purchaseWithRewardPoints = async (
  coupon: Coupon
): Promise<SuccessResponse> => {
  if (!coupon.points_amount) {
    return {
      success: false,
      message: 'Coupon does not allow purchase sing Reward Points.',
    };
  }

  const user = await fetchConsumer();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
    );
  }

  try {
    updateCouponData(coupon.id);
    updateRewardPoints(user.id, coupon.points_amount);
    updateConsumerFirstPurchase(user.id);
    insertConsumerCoupon(coupon.id, user.id);

    return { success: true, message: 'Coupon purchased successfully!' };
  } catch (error) {
    console.error('Error purchasing with reward points:', error);
    return { success: false, message: 'Failed to purchase coupon.' };
  }
};

const fetchConsumer = async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

const insertConsumerCoupon = async (
  couponId: string,
  consumerId: string
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const qrToken = uuidv4();

    const { error: insertConsumerCouponError } = await supabase
      .from('consumer_coupons')
      .insert({
        coupon_id: couponId,
        consumer_id: consumerId,
        qr_token: qrToken,
      });

    if (insertConsumerCouponError) {
      throw new Error(
        `INSERT USER COUPON ERROR: ${insertConsumerCouponError.message}`
      );
    }

    return { success: true, message: 'Coupon inserted successfully!' };
  } catch (error) {
    console.error('Error inserting consumer coupon:', error);
    return { success: false, message: (error as Error).message };
  }
};

const updateCouponData = async (couponId: string): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .select('quantity, is_deactivated')
      .eq('id', couponId)
      .single();

    if (couponError) {
      throw new Error(
        `FETCH COUPON ERROR IN UPDATE STATUS: ${couponError.message}`
      );
    }
    const newQuantity = couponData.quantity - 1;
    const { error: updateError } = await supabase
      .from('coupons')
      .update({
        quantity: newQuantity,
        is_deactivated: newQuantity === 0,
      })
      .eq('id', couponId);

    if (updateError) {
      throw new Error(`UPDATE COUPON ERROR: ${updateError.message}`);
    }

    return { success: true, message: 'Coupon updated successfully!' };
  } catch (error) {
    console.error('Error updating coupon data:', error);
    return { success: false, message: (error as Error).message };
  }
};

const updateRewardPoints = async (
  consumerId: string,
  pointsAmount: number
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: consumerData, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (fetchConsumerError) {
      throw new Error(`FETCH CONSUMER ERROR: ${fetchConsumerError.message}`);
    }

    const newPointsBalance: number = consumerData.points_balance - pointsAmount;
    const { error: updateConsumerError } = await supabase
      .from('consumers')
      .update({ points_balance: newPointsBalance })
      .eq('id', consumerId);

    if (updateConsumerError) {
      throw new Error(
        `UPDATE CONSUMER POINTS BALANCE ERROR: ${updateConsumerError.message}`
      );
    }

    return { success: true, message: 'Points updated successfully!' };
  } catch (error) {
    console.error('Error updating reward points:', error);
    return { success: false, message: (error as Error).message };
  }
};

const updateConsumerFirstPurchase = async (
  consumerId: string
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: consumerData, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (fetchConsumerError) {
      throw new Error(`FETCH CONSUMER ERROR: ${fetchConsumerError.message}`);
    }

    if (!consumerData.has_purchased) {
      const { error: updateHasPurchasedError } = await supabase
        .from('consumers')
        .update({ has_purchased: true })
        .eq('id', consumerId);

      if (updateHasPurchasedError) {
        throw new Error(
          `UPDATE HAS PURCHASED ERROR: ${updateHasPurchasedError.message}`
        );
      }

      if (consumerData.referrer_code) {
        rewardReferrer(consumerData.referrer_code);
      }
    }

    return {
      success: true,
      message: 'Consumer first purchase updated successfully!',
    };
  } catch (error) {
    console.error('Error updating consumer first purchase:', error);
    return { success: false, message: (error as Error).message };
  }
};

const rewardReferrer = async (referrerId: string): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: referrer, error: fetchReferrerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('referral_code', referrerId)
      .single();

    if (fetchReferrerError) {
      throw new Error(`FETCH REFERRER ERROR: ${fetchReferrerError.message}`);
    }

    const REWARD: number = 50;
    const newReferrerPointsBalance: number = referrer.points_balance + REWARD;

    const { error: updateReferrerError } = await supabase
      .from('consumers')
      .update({
        points_balance: newReferrerPointsBalance,
        points_total: referrer.points_total + REWARD,
      })
      .eq('id', referrer.id);

    if (updateReferrerError) {
      throw new Error(
        `UPDATE REFERRER POINTS BALANCE ERROR: ${updateReferrerError.message}`
      );
    }

    return { success: true, message: 'Referrer rewarded successfully!' };
  } catch (error) {
    console.error('Error rewarding referrer:', error);
    return { success: false, message: (error as Error).message };
  }
};

const rebateConsumerPoints = async (
  consumerId: string,
  price: number
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { data: consumerData, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (fetchConsumerError) {
      throw new Error(`FETCH CONSUMER ERROR: ${fetchConsumerError.message}`);
    }

    const rebatePoints: number = Math.round(price * 0.01 * 100) / 100;
    const { error: updateRebateError } = await supabase
      .from('consumers')
      .update({
        points_balance: consumerData.points_balance + rebatePoints,
        points_total: consumerData.points_total + rebatePoints,
      })
      .eq('id', consumerId);

    if (updateRebateError) {
      throw new Error(
        `Error updating consumer points balance after rebate: ${updateRebateError.message}`
      );
    }

    return { success: true, message: 'Consumer points rebated successfully!' };
  } catch (error) {
    console.error('Error rebating consumer points:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const createPaypalOrder = async (
  coupon: Coupon
): Promise<SuccessResponse<string>> => {
  try {
    const user = await fetchConsumer();

    if (!user) {
      redirect(
        `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
      );
    }
    const order = await createOrder(coupon.price);

    return {
      success: true,
      message: 'PayPal order created successfully!',
      data: order.id as string,
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw new Error('Failed to create PayPal order.');
  }
};

export const approvePaypalOrder = async (
  coupon: Coupon,
  orderId: string
): Promise<SuccessResponse> => {
  try {
    const user = await fetchConsumer();

    if (!user) {
      redirect(
        `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
      );
    }
    const captureData = await createPayment(orderId);

    if (!captureData || captureData.status !== 'COMPLETED') {
      throw new Error('PayPal order / payment capture not approved.');
    }

    updateCouponData(coupon.id);
    updateConsumerFirstPurchase(user.id);
    insertConsumerCoupon(coupon.id, user.id);
    rebateConsumerPoints(user.id, coupon.price);

    return { success: true, message: 'Coupon purchased successfully!' };
  } catch (error) {
    console.error('Error approving PayPal order:', error);
    return { success: false, message: 'Failed to approve PayPal order.' };
  }
};
