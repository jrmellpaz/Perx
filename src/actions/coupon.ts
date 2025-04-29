'use server';

import { createClient } from '@/utils/supabase/server';
import { embedText } from './embedder';

import type {
  Categories,
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

    // ✨ Combine fields for text search
    const combinedText =
      `${couponData.title} ${couponData.description} ${couponData.category}`.trim();

    // ✨ Generate embedding
    const embedding = await embedText(combinedText);

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

export const fetchCoupons = async (
  consumerId: string = ''
): Promise<Coupons> => {
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
    .select('*')
    .eq('isDeactivated', false)
    .gt('quantity', 0)
    .order('created_at', { ascending: false })
    .range(0, 9);

  if (couponsError) {
    console.error('Fetch Coupons Error:', couponsError);
    return [];
  }

  type FilteredCoupon = Coupon & {
    priority?: number;
  };

  const filteredAndRanked: FilteredCoupon[] = (couponsData || [])
    .filter((coupon: FilteredCoupon) => {
      const isWithinDateRange =
        !coupon.allowLimitedPurchase ||
        (coupon.allowLimitedPurchase &&
          new Date(coupon.validFrom).getTime() <= Date.now() &&
          new Date(coupon.validTo).getTime() >= Date.now());
      return isWithinDateRange;
    })
    .map((coupon: FilteredCoupon) => ({
      ...coupon,
      priority: interests.includes(coupon.category) ? 1 : 0,
    }))
    .sort((a: FilteredCoupon, b: FilteredCoupon) => b.priority! - a.priority!);

  return filteredAndRanked as Coupons;
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
    .order('created_at', { ascending: false });

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
    .order('created_at', { ascending: false });

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

type CouponFilters = {
  minPrice?: number;
  maxPrice?: number;
  allowLimitedPurchase?: boolean;
  allowRepeatPurchase?: boolean;
  allowPointsPurchase?: boolean;
  endDate?: Date;
  query?: string;
};

export async function filterCoupons(filters: CouponFilters & { query?: string }): Promise<Coupon[]> {
  const supabase = await createClient();
  let queryBuilder = supabase.from('coupons').select('*');

  if (filters.query) {
    // Option 1: Use text search (requires full-text index in PostgreSQL)
    // queryBuilder = queryBuilder.textSearch('name', filters.query);

    // Option 2: Use ILIKE for case-insensitive partial matching
    queryBuilder = queryBuilder.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
  }

  if (filters.minPrice !== undefined) {
    queryBuilder = queryBuilder.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    queryBuilder = queryBuilder.lte('price', filters.maxPrice);
  }
  if (filters.allowLimitedPurchase !== undefined) {
    queryBuilder = queryBuilder.eq('allowLimitedPurchase', filters.allowLimitedPurchase);
  }
  if (filters.allowRepeatPurchase !== undefined) {
    queryBuilder = queryBuilder.eq('allowRepeatPurchase', filters.allowRepeatPurchase);
  }
  if (filters.allowPointsPurchase !== undefined) {
    queryBuilder = queryBuilder.eq('allowPointsPurchase', filters.allowPointsPurchase);
  }
  if (filters.endDate !== undefined) {
    queryBuilder = queryBuilder.lte('validTo', filters.endDate.toISOString());
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Error fetching filtered coupons:', error);
    return [];
  }

  return data as Coupon[];
}