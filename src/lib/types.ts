import { Database } from './database.types';

// Rank
export type Rank = Database['public']['Tables']['ranks']['Row'];
export type Ranks = Rank[];

// Coupon
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type Coupons = Coupon[];
export type CouponCategory =
  Database['public']['Tables']['coupon_categories']['Row'];
export type CouponCategories = CouponCategory[];
export type InsertCoupon = Database['public']['Tables']['coupons']['Insert'];

// Success types
export type SuccessResponse = { success: boolean; message: string };
