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
export type UserCoupon = Database['public']['Tables']['user_coupons']['Row'] & {
  coupons: Coupon;
};
export type UserCoupons = UserCoupon[];

// Consumer
export type Consumer = Database['public']['Tables']['consumers']['Row'];

// Merchant
export type Merchant = Database['public']['Tables']['merchants']['Row'];
export type Merchants = Merchant[];

// Achievement
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type Achievements = Achievement[];

// Success types
export type SuccessResponse = { success: boolean; message: string };
