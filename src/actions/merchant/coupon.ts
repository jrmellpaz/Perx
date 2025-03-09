'use server';

import { createClient } from '@/utils/supabase/server';
import { AddCouponInputs, MerchantCoupon } from '@/lib/merchant/couponSchema';

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
    // .single();

    if (roleError)
      throw new Error(`MERCHANT LOOKUP ERROR: ${roleError.message}`);

    // Image handling: Upload the coupon image
    let imageUrl = null;
    if (couponData.image) {
      // const fileExt = couponData.image.name.split('.').pop();
      // const filePath = `coupons/${merchantId}/${Date.now()}.${fileExt}`;
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

    // Step 1: Check if the type exists in coupon_types
    let { data: existingType, error: typeError } = await supabase
      .from('coupon_types')
      .select('id')
      .eq('type', couponData.type)
      .single();

    if (typeError && typeError.code !== 'PGRST116') {
      throw new Error(`CHECK TYPE ERROR: ${typeError.message}`);
    }

    let couponTypeId = existingType?.id;

    // Step 2: Insert type if it doesn't exist
    if (!couponTypeId) {
      const { data: insertedType, error: insertTypeError } = await supabase
        .from('coupon_types')
        .insert({ type: couponData.type })
        .select('id')
        .single();

      if (insertTypeError) {
        throw new Error(`INSERT TYPE ERROR: ${insertTypeError.message}`);
      }

      couponTypeId = insertedType.id;
    }

    // Step 3: Insert coupon details with image URL
    const { error: insertError } = await supabase.from('coupons').insert({
      merchant_id: merchantId,
      title: couponData.title,
      coupon_type_id: couponTypeId,
      description: couponData.description,
      price: couponData.price,
      quantity: couponData.quantity,
      valid_from: couponData.validFrom,
      valid_to: couponData.validTo,
      image: imageUrl, // Store image URL
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
        'id, description, price, valid_from, valid_to, is_deactivated, image, title, quantity, coupon_type_id'
      )
      .eq('merchant_id', merchantId);

    if (error) throw new Error(error.message);

    return data as MerchantCoupon[];
  } catch (error) {
    console.error('Get Merchant Coupons Error:', error);
    return [];
  }
}
