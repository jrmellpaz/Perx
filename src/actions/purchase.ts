'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createPayment } from './paypal';
import { levelUpConsumerRank } from './rank';
import { toast } from 'sonner';

import type { ConsumerCoupon, Coupon, SuccessResponse } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

export const checkPurchaseLimit = async (
  consumerId: string,
  couponId: string,
  options: { max_purchase_limit_per_consumer?: number; quantity: number }
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { count, error: countError } = await supabase
      .from('consumer_coupons')
      .select('*', { count: 'exact' })
      .eq('consumer_id', consumerId)
      .eq('coupon_id', couponId);

    if (countError) {
      throw new Error('Failed to count existing purchases.');
    }

    const purchaseCount = count ?? 0;

    if (
      purchaseCount + options.quantity >
      (options.max_purchase_limit_per_consumer ?? 1)
    ) {
      return {
        success: false,
        message:
          'You have already purchased the maximum limit purchase of this coupon.',
      };
    }

    // Check if purchase quantity exceeds coupon quantity
    const { data: couponData, error: fetchCouponError } = await supabase
      .from('coupons')
      .select('quantity')
      .eq('id', couponId)
      .single();

    if (fetchCouponError || !couponData) {
      throw new Error(`FETCH COUPON ERROR: ${fetchCouponError?.message}`);
    }

    if (couponData.quantity < options.quantity) {
      return {
        success: false,
        message: `Only ${couponData.quantity} coupons left.`,
      };
    }

    return { success: true, message: 'Within purchase limit' };
  } catch (error) {
    console.error('Error checking purchase limit:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const purchaseWithRewardPoints = async (
  coupon: Coupon,
  options: { hybrid?: boolean; quantity: number }
): Promise<SuccessResponse> => {
  const { hybrid = false } = options || {};

  if (!coupon.points_amount) {
    return {
      success: false,
      message: 'Coupon does not allow purchase using Reward Points.',
    };
  }

  const user = await fetchConsumer();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
    );
  }

  try {
    const supabase = await createClient();

    const pointsUpdate = await updateRewardPoints(
      user.id,
      -coupon.points_amount
    );
    if (!pointsUpdate.success) {
      // toast('Not enough points to purchase this coupon');
      return { success: false, message: 'Insufficient points balance.' };
    }
    updateConsumerFirstPurchase(user.id);

    if (!hybrid) {
      const { data: existingConsumerCoupon, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', coupon.id)
        .single();

      if (fetchError) {
        throw new Error(`FETCH COUPON ERROR: ${fetchError.message}`);
      }

      insertConsumerCoupon(coupon.id, user.id, options.quantity);
      updateCouponData(coupon.id, options.quantity);
      toast.success(`Redirecting you to your coupon...`);
      redirect(`/my-coupons`);
    }

    return {
      success: true,
      message: hybrid
        ? 'Points deducted. Proceed with cash payment to complete purchase.'
        : 'Coupon purchased successfully!',
    };
  } catch (error) {
    console.error('Error purchasing with reward points:', error);
    return { success: false, message: 'Failed to purchase coupon.' };
  }
};

export const checkConsumerPointsBalance = async (
  points: number
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'You are not logged in. Please log in to continue.',
      };
    }

    const { data: consumerData, error: fetchConsumerError } = await supabase
      .from('consumers')
      .select('points_balance')
      .eq('id', user.id)
      .single();

    if (fetchConsumerError) {
      throw new Error(`FETCH CONSUMER ERROR: ${fetchConsumerError.message}`);
    }

    if (consumerData.points_balance < points) {
      return {
        success: false,
        message: 'Insufficient points balance.',
      };
    }

    return { success: true, message: 'Sufficient points balance.' };
  } catch (error) {
    console.error('Error checking consumer points balance:', error);
    return { success: false, message: (error as Error).message };
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
  consumerId: string,
  quantity: number,
  paymentAmount?: number // Add optional payment amount parameter
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();

    const { data: existingConsumerCoupon, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();

    if (fetchError) {
      throw new Error(`FETCH COUPON ERROR: ${fetchError.message}`);
    }

    for (let i = 0; i < quantity; i++) {
      const qrToken = uuidv4();
      const { data: consumerCouponData, error: insertConsumerCouponError } =
        await supabase
          .from('consumer_coupons')
          .insert({
            coupon_id: couponId,
            consumer_id: consumerId,
            merchant_id: existingConsumerCoupon.merchant_id,
            qr_token: qrToken,
            details: {
              title: existingConsumerCoupon.title,
              description: existingConsumerCoupon.description,
              image: existingConsumerCoupon.image,
              category: existingConsumerCoupon.category,
              accent_color: existingConsumerCoupon.accent_color,
              original_price: existingConsumerCoupon.original_price,
              discounted_price: existingConsumerCoupon.discounted_price,
              max_purchase_limit_per_consumer:
                existingConsumerCoupon.max_purchase_limit_per_consumer,
            },
          })
          .select('*, coupons(*)')
          .single();

      if (insertConsumerCouponError) {
        throw new Error(
          `INSERT USER COUPON ERROR: ${insertConsumerCouponError.message}`
        );
      }

      if (!consumerCouponData) {
        throw new Error('No data returned from insert operation.');
      }
    }

    // Use provided payment amount or fall back to standard pricing
    const transactionPrice = paymentAmount === -1 ? null : paymentAmount;

    const { error: insertTransactionError } = await supabase
      .from('transactions_history')
      .insert({
        coupon_id: couponId,
        merchant_id: existingConsumerCoupon.merchant_id,
        consumer_id: consumerId,
        price: transactionPrice,
      });

    if (insertTransactionError) {
      throw new Error(
        `INSERT TRANSACTION ERROR: ${insertTransactionError.message}`
      );
    }

    return {
      success: true,
      message: 'Coupon inserted successfully!',
    };
  } catch (error) {
    console.error('Error inserting consumer coupon:', error);
    return { success: false, message: (error as Error).message };
  }
};

const updateCouponData = async (
  couponId: string,
  quantity: number
): Promise<SuccessResponse> => {
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
    const newQuantity = couponData.quantity - quantity;
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

export const updateRewardPoints = async (
  consumerId: string,
  pointsAmount: number,
  source?: string
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

    const newPointsBalance: number = consumerData.points_balance + pointsAmount;
    const { error: updateConsumerError } = await supabase
      .from('consumers')
      .update({ points_balance: newPointsBalance })
      .eq('id', consumerId);

    if (updateConsumerError) {
      return { success: false, message: 'Insufficient points balance.' };
    }

    const { error: insertPointsError } = await supabase
      .from('points_history')
      .insert({
        consumer_id: consumerId,
        source: source || 'Coupon purchase',
        points_earned: pointsAmount,
      });

    if (insertPointsError) {
      throw new Error(
        `UPDATE REFERRER POINTS BALANCE ERROR: ${insertPointsError.message}`
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

    const { error: insertPointsError } = await supabase
      .from('points_history')
      .insert({
        consumer_id: referrer.id,
        source: 'Referral Reward',
        points_earned: REWARD,
      });

    if (insertPointsError) {
      throw new Error(
        `UPDATE REFERRER POINTS BALANCE ERROR: ${insertPointsError.message}`
      );
    }

    return { success: true, message: 'Referrer rewarded successfully!' };
  } catch (error) {
    console.error('Error rewarding referrer:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const rebateConsumerPoints = async (
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

    const rebatePoints: number = Number((price * 0.01).toFixed(2));

    console.log('rebatePoints:', rebatePoints);
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

    const { error: insertPointsError } = await supabase
      .from('points_history')
      .insert({
        consumer_id: consumerId,
        source: 'Coupon purchase rebate',
        points_earned: rebatePoints,
      });

    if (insertPointsError) {
      throw new Error(
        `UPDATE REFERRER POINTS BALANCE ERROR: ${insertPointsError.message}`
      );
    }

    return { success: true, message: 'Consumer points rebated successfully!' };
  } catch (error) {
    console.error('Error rebating consumer points:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const approvePaypalOrder = async (
  coupon: Coupon,
  orderId: string,
  paymentMode: 'cash' | 'hybrid', // Add payment mode parameter
  amountToPay: number,
  quantity: number
): Promise<SuccessResponse<ConsumerCoupon>> => {
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

    await updateCouponData(coupon.id, quantity);
    await updateConsumerFirstPurchase(user.id);

    if (paymentMode === 'hybrid') {
      await purchaseWithRewardPoints(coupon, {
        hybrid: true,
        quantity,
      });
    }

    const {
      success,
      message,
      data: consumerCoupon,
    } = await insertConsumerCoupon(coupon.id, user.id, quantity, amountToPay);

    if (!success) {
      return {
        success: false,
        message: message || 'Failed to insert consumer coupon.',
      };
    }

    await rebateConsumerPoints(user.id, amountToPay);
    await levelUpConsumerRank(user.id);

    return {
      success: true,
      message: 'Coupon purchased successfully!',
      data: consumerCoupon,
    };
  } catch (error) {
    console.error('Error approving PayPal order:', error);
    return { success: false, message: 'Failed to approve PayPal order.' };
  }
};

export const getHighestOriginalPrice = async (): Promise<number> => {
  try {
    const supabase = await createClient();
    const { data: maxPriceData } = await supabase.rpc(
      'get_highest_original_price'
    );
    return Number(maxPriceData);
  } catch (error) {
    console.error('Error getting highest price:', error);
    return 1000000; // fallback value
  }
};
