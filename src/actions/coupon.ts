'use server';

import { createClient } from '@/utils/supabase/server';

import type {
  Coupon,
  CouponCategories,
  Coupons,
  InsertCoupon,
  SuccessResponse,
  UserCoupons,
} from '@/lib/types';
import type { AddCouponInputs } from '@/lib/couponSchema';

export const addCoupon = async (
  couponData: AddCouponInputs
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: fetchUserError,
    } = await supabase.auth.getUser();

    if (fetchUserError) {
      throw new Error(`FETCH USER ERROR: ${fetchUserError.message}`);
    }

    let imageUrl: string | null = null;

    if (couponData.image) {
      const date = Date.now();
      const imageName = `${user?.id}-${date}`;

      const { error: uploadImageError } = await supabase.storage
        .from('perx')
        .upload(`coupons/${imageName}`, couponData.image[0]);

      if (uploadImageError) {
        throw new Error(`IMAGE UPLOAD ERROR: ${uploadImageError.message}`);
      }

      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('perx')
        .getPublicUrl(`coupons/${imageName}`);

      imageUrl = publicUrl;
    }

    const { error: insertCouponError } = await supabase.from('coupons').insert({
      accentColor: couponData.accentColor,
      merchantId: user?.id,
      title: couponData.title,
      category: couponData.category,
      description: couponData.description,
      price: couponData.price,
      quantity: couponData.quantity,
      rankAvailability: couponData.rankAvailability,
      allowLimitedPurchase: couponData.allowLimitedPurchase,
      validFrom: couponData.allowLimitedPurchase
        ? couponData.dateRange?.start
        : new Date().toISOString(),
      validTo: couponData.allowLimitedPurchase
        ? couponData.dateRange?.end
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      image: imageUrl,
      allowPointsPurchase: couponData.allowPointsPurchase,
      pointsAmount: couponData.pointsAmount,
      allowRepeatPurchase: couponData.allowRepeatPurchase,
    } as InsertCoupon);

    if (insertCouponError) {
      throw new Error(`INSERT COUPON ERROR: ${insertCouponError.message}`);
    }

    return { success: true, message: 'Coupon added successfully!' };
  } catch (error) {
    console.error(`ADD COUPON ERROR: ${error}`);
    return { success: false, message: (error as Error).message };
  }
};

export const fetchCoupons = async (): Promise<Coupons> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Fetch Coupons Error:', error);
    return [];
  }

  return data as Coupons;
};

export const fetchCoupon = async (couponId: string): Promise<Coupon> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', couponId)
    .single();

  if (error) {
    console.error('Fetch Coupon Error:', error);
  }

  return data as Coupon;
};

export const fetchCouponsByMerchantId = async (
  merchantId: string
): Promise<Coupons> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('merchantId', merchantId)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Fetch Coupons by Merchant ID Error:', error);
    return [];
  }

  return data as Coupons;
};

export const fetchCouponsByConsumerId = async (
  consumerId: string
): Promise<UserCoupons> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_coupons')
    .select('*, coupons(*)')
    .eq('consumerId', consumerId)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Fetch Coupons by Consumer ID Error:', error);
    return [];
  }

  return data as UserCoupons;
};

export const fetchCouponCategories = async (): Promise<CouponCategories> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupon_categories').select('*');

  if (error) {
    console.error('Fetch Coupon Categories Error:', error);
    return [];
  }

  return data as CouponCategories;
};
