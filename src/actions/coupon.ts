'use server';

import { createClient } from '@/utils/supabase/server';

import type {
  Categories,
  Coupon,
  CouponCategories,
  Coupons,
  CouponWithRank,
  InsertCoupon,
  SuccessResponse,
  ConsumerCoupon,
  ConsumerCoupons,
} from '@/lib/types';
import type { AddCouponInputs } from '@/lib/couponSchema';
import { redirect } from 'next/navigation';

type FetchCouponsResponse = {
  coupons: CouponWithRank[];
  count: number;
};

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

    if (
      couponData.discountedPrice != null &&
      couponData.discountedPrice >= couponData.originalPrice
    ) {
      return {
        success: false,
        message: 'Discounted Price must be less than Original Price',
      };
    }

    const comparePrice = couponData.discountedPrice || couponData.originalPrice;
    if (
      couponData.cashAmount !== undefined &&
      couponData.cashAmount >= comparePrice
    ) {
      return {
        success: false,
        message:
          'Cash amount must be less than the Discounted Price (or Original Price if no Discount Price)',
      };
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

    // Combine fields for text search
    const combinedText =
      `${couponData.title} ${couponData.description} ${couponData.category}`.trim();

    const { error: insertCouponError } = await supabase.from('coupons').insert({
      accent_color: couponData.accentColor,
      merchant_id: user?.id,
      title: couponData.title,
      category: couponData.category,
      description: couponData.description,
      original_price: couponData.originalPrice,
      discounted_price: couponData.discountedPrice,
      quantity: couponData.quantity,
      rank_availability: couponData.rankAvailability,
      valid_from:
        couponData.dateRange?.start !== null
          ? couponData.dateRange?.start
          : null,
      valid_to:
        couponData.dateRange?.end !== null ? couponData.dateRange?.end : null,
      image: imageUrl,
      points_amount: couponData.pointsAmount,
      cash_amount: couponData.cashAmount,
      max_purchase_limit_per_consumer: couponData.maxPurchaseLimitPerUser,
      redemption_validity: couponData.redemptionValidity,
      text_search: combinedText,
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

export const fetchCoupons = async (
  consumerId: string | undefined,
  offset: number = 0,
  limit: number = 12
): Promise<FetchCouponsResponse> => {
  const supabase = await createClient();

  let interests: Categories = [];

  if (consumerId) {
    const { data: consumerData, error: consumerError } = await supabase
      .from('consumers')
      .select('interests')
      .eq('id', consumerId)
      .single();

    if (consumerError) {
      console.error('Fetch Consumer Error:', consumerError);
    } else {
      interests = consumerData?.interests || [];
    }
  }

  const { data: couponsData, error: couponsError } = await supabase
    .from('coupons')
    .select('*, ranks(*)')
    .eq('is_deactivated', false)
    .gt('quantity', 0)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (couponsError) {
    console.error('Fetch Coupons Error:', couponsError);
    return { coupons: [], count: 0 };
  }

  type FilteredCoupon = CouponWithRank & {
    priority?: number;
  };

  const filteredAndRanked: FilteredCoupon[] = (couponsData || [])
    .filter((coupon: FilteredCoupon) => {
      const now = Date.now();
      const isWithinDateRange =
        (!coupon.valid_from || new Date(coupon.valid_from).getTime() <= now) &&
        (!coupon.valid_to || new Date(coupon.valid_to).getTime() >= now);

      return isWithinDateRange;
    })
    .map((coupon: FilteredCoupon) => ({
      ...coupon,
      priority: interests.includes(coupon.category) ? 1 : 0,
    }))
    .sort((a: FilteredCoupon, b: FilteredCoupon) => b.priority! - a.priority!);

  return {
    coupons: filteredAndRanked as CouponWithRank[],
    count: couponsData.length,
  };
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
  merchantId: string,
  offset: number = 0,
  limit: number = 12,
  {
    isDeactivated = false,
  }: {
    isDeactivated: boolean;
  }
): Promise<FetchCouponsResponse> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*, ranks(*)')
    .eq('merchant_id', merchantId)
    .eq('is_deactivated', isDeactivated)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Fetch Coupons by Merchant ID Error:', error);
    return { coupons: [], count: 0 };
  }

  return { coupons: data as CouponWithRank[], count: data.length };
};

export const fetchConsumerCoupons = async (
  consumerId: string
): Promise<ConsumerCoupons> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consumer_coupons')
    .select('*, coupons(*)')
    .eq('consumer_id', consumerId)
    .eq('is_redeemed', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch Coupons by Consumer ID Error:', error);
    return [];
  }

  return data as ConsumerCoupons;
};

export const fetchConsumerCoupon = async (
  consumerCouponId: number
): Promise<ConsumerCoupon> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consumer_coupons')
    .select('*')
    .eq('id', consumerCouponId)
    .single();

  if (error) {
    console.error('Fetch Consumer Coupon Error:', error);
  }

  return data as ConsumerCoupon;
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

type CouponFilters = {
  minPrice?: number;
  maxPrice?: number;
  allowLimitedPurchase?: boolean;
  allowRepeatPurchase?: boolean;
  allowPointsPurchase?: boolean;
  endDate?: Date;
  query?: string;
};

export async function filterCoupons(
  filters: CouponFilters & { query?: string }
): Promise<CouponWithRank[]> {
  const supabase = await createClient();
  let queryBuilder = supabase
    .from('coupons')
    .select('*, ranks(*)')
    .eq('is_deactivated', false);

  if (filters.query) {
    // Option 1: Use text search (requires full-text index in PostgreSQL)
    // queryBuilder = queryBuilder.textSearch('name', filters.query);

    // Option 2: Use ILIKE for case-insensitive partial matching
    queryBuilder = queryBuilder.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    );
  }

  if (filters.minPrice !== undefined) {
    queryBuilder = queryBuilder.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    queryBuilder = queryBuilder.lte('price', filters.maxPrice);
  }
  if (filters.allowLimitedPurchase !== undefined) {
    queryBuilder = queryBuilder.eq(
      'allow_limited_purchase',
      filters.allowLimitedPurchase
    );
  }
  if (filters.allowRepeatPurchase !== undefined) {
    queryBuilder = queryBuilder.eq(
      'allow_repeat_purchase',
      filters.allowRepeatPurchase
    );
  }
  if (filters.allowPointsPurchase !== undefined) {
    queryBuilder = queryBuilder.eq(
      'allow_points_purchase',
      filters.allowPointsPurchase
    );
  }
  if (filters.endDate !== undefined) {
    queryBuilder = queryBuilder.lte('valid_to', filters.endDate.toISOString());
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Error fetching filtered coupons:', error);
    return [];
  }

  return data as CouponWithRank[];
}

export async function redeemCoupon(
  qrToken: string
) : Promise<SuccessResponse> {
  if (!qrToken) return { success: false, message: 'Missing QR token' };
  const supabase = await createClient();

  const { data: myCoupon, error: lookupError } = await supabase
    .from('consumer_coupons')
    .select('id')
    .eq('qr_token', qrToken)
    .maybeSingle();

  if (lookupError || !myCoupon) {
    return { success: false, message: 'Invalid or already redeemed coupon.' };
  }
  const { error: updateError } = await supabase
    .from('consumer_coupons')
    .update({ is_redeemed: true })
    .eq('id', myCoupon.id);
  if (updateError) {
    return { success: false, message: 'Failed to redeem coupon.' };
  }

  return { success: true, message: 'Coupon successfully redeemed.' };
}

export async function getCouponFromToken(
  qrToken: string
): Promise<SuccessResponse | Coupon>{
  const supabase = await createClient();
  if (!qrToken) return { success: false, message: 'Missing QR token' };
  const { data: myCoupon, error } = await supabase
    .from('consumer_coupons')
    .select('id, coupon:coupon_id (*)')
    .eq('qr_token', qrToken)
    .maybeSingle();

  if (error || !myCoupon) {
    return { success: false, message: 'Invalid or expired QR code.' };
  }

  return myCoupon.coupon as Coupon;
};

export const archiveCoupon = async (
  couponId: string
): Promise<SuccessResponse> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: merchantAuthError,
  } = await supabase.auth.getUser();

  if (merchantAuthError) {
    throw merchantAuthError;
  }

  const role: 'merchant' | 'consumer' = user?.user_metadata.role;

  if (role !== 'merchant') {
    redirect('/merchant/login');
  }

  try {
    const { error: archiveError } = await supabase
      .from('coupons')
      .update({ is_deactivated: true })
      .eq('id', couponId)
      .eq('merchant_id', user?.id!);

    if (archiveError) {
      throw archiveError;
    }

    return { success: true, message: 'Coupon archived successfully!' };
  } catch (error) {
    console.error('Error archiving coupon:', error);
    return { success: false, message: 'Failed to archive coupon.' };
  }
};
