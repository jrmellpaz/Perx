'use server';

import { createClient } from '@/utils/supabase/server';
import {
  AddCouponInputs,
  CouponCategory,
  MerchantCoupon,
} from '@/lib/merchant/couponSchema';

export async function addCoupon(couponData: AddCouponInputs) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    const merchantId = data.user.id;

    // Ensure the merchant exists
    const { data: roleData, error: roleError } = await supabase
      .from('merchants')
      .select('id')
      .eq('id', merchantId);

    if (roleError)
      throw new Error(`MERCHANT LOOKUP ERROR: ${roleError.message}`);

    // Image handling: Upload the coupon image
    let imageUrl = null;
    if (couponData.image) {
      const date = Date.now();
      const { error: uploadError } = await supabase.storage
        .from('perx')
        .upload(`coupons/${merchantId}-${date}`, couponData.image[0]);

      if (uploadError)
        throw new Error(`IMAGE UPLOAD ERROR: ${uploadError.message}`);

      const { data: imagePublicUrl } = await supabase.storage
        .from('perx')
        .getPublicUrl(`coupons/${merchantId}-${date}`);

      imageUrl = imagePublicUrl.publicUrl;
    }

    // Insert coupon details with image URL
    const { error: insertError } = await supabase.from('coupons').insert({
      merchant_id: merchantId,
      title: couponData.title,
      category: couponData.category,
      description: couponData.description,
      price: couponData.price,
      quantity: couponData.quantity,
      allow_limited_purchase: couponData.allowLimitedPurchase,
      valid_from: couponData.allowLimitedPurchase
        ? couponData.dateRange?.start
        : new Date().toISOString(),
      valid_to: couponData.allowLimitedPurchase
        ? couponData.dateRange?.end
        : new Date(Date.now() + 31536000000).toISOString(),
      image: imageUrl,
      accent_color: couponData.accentColor,
      rank_availability: couponData.consumerRankAvailability,
      allow_points_purchase: couponData.allowPointsPurchase,
      points_amount: couponData.pointsAmount,
      allow_repeat_purchase: couponData.allowRepeatPurchase,
    });

    if (insertError) {
      throw new Error(`INSERT COUPON ERROR: ${insertError.message}`);
    }

    return { success: true, message: 'Coupon added successfully!' };
  } catch (error) {
    console.error('Add Coupon Error:', error);
    return { success: false, message: (error as Error).message };
  }
}

export async function getMerchantCoupons(merchantId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('coupons')
      .select(
        'id, description, price, allow_limited_purchase, valid_from, valid_to, is_deactivated, image, title, quantity, category, accent_color, rank_availability, allow_points_purchase, points_amount, allow_repeat_purchase'
      )
      .eq('merchant_id', merchantId)
      .eq('is_deactivated', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      allowLimitedPurchase: item.allow_limited_purchase,
      validFrom: item.valid_from,
      validTo: item.valid_to,
      isDeactivated: item.is_deactivated,
      image: item.image,
      quantity: item.quantity,
      category: item.category,
      accentColor: item.accent_color,
      consumerAvailability: item.rank_availability,
      allowPointsPurchase: item.allow_points_purchase,
      pointsAmount: item.points_amount || null,
      allowRepeatPurchase: item.allow_repeat_purchase,
    })) as MerchantCoupon[];
  } catch (error) {
    console.error('Get Merchant Coupons Error:', error);
    return [];
  }
}

export async function fetchCouponCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('coupon_categories')
      .select('category, description')
      .order('category');

    if (error) throw new Error(error.message);

    return data as CouponCategory[];
  } catch (error) {
    console.error('Fetch Coupon Categories Error:', error);
    return [];
  }
}

export async function fetchCoupon(id: string): Promise<MerchantCoupon | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('coupons')
      .select(
        'id, merchant_id, description, price, allow_limited_purchase, valid_from, valid_to, is_deactivated, image, title, quantity, category, accent_color, rank_availability, allow_points_purchase, points_amount, allow_repeat_purchase'
      )
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Coupon not found');

    // Map snake_case to camelCase
    const coupon: MerchantCoupon = {
      id: data.id,
      merchantId: data.merchant_id,
      title: data.title,
      description: data.description,
      price: data.price,
      allowLimitedPurchase: data.allow_limited_purchase,
      validFrom: data.valid_from,
      validTo: data.valid_to,
      isDeactivated: data.is_deactivated,
      image: data.image,
      quantity: data.quantity,
      category: data.category,
      accentColor: data.accent_color,
      consumerAvailability: data.rank_availability,
      allowPointsPurchase: data.allow_points_purchase,
      pointsAmount: data.points_amount,
      allowRepeatPurchase: data.allow_repeat_purchase,
    };

    return coupon;
  } catch (error) {
    console.error('Fetch Coupon Error:', error);
    return null;
  }
}
