import { Database } from './database.types';

export type PointsHistory =
  Database['public']['Tables']['points_history']['Row'];
export type PointsHistories = PointsHistory[];

// Combination
export type CouponWithRank = Database['public']['Tables']['coupons']['Row'] & {
  ranks: Database['public']['Tables']['ranks']['Row'];
};
export type TransactionWithCoupon =
  Database['public']['Tables']['transactions_history']['Row'] & {
    coupons: Database['public']['Tables']['coupons']['Row'];
  };

// Rank
export type Rank = Database['public']['Tables']['ranks']['Row'];
export type Ranks = Rank[];

// Coupon
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type Coupons = Coupon[];
export type CouponCategory =
  Database['public']['Tables']['coupon_categories']['Row'];
export type CouponCategories = CouponCategory[];
export type Category = Database['public']['Enums']['coupon_category'];
export type Categories = Category[];
export type InsertCoupon = Database['public']['Tables']['coupons']['Insert'];
export type ConsumerCoupon =
  Database['public']['Tables']['consumer_coupons']['Row'];
export type ConsumerCoupons = ConsumerCoupon[];

// Consumer
export type Consumer = Database['public']['Tables']['consumers']['Row'];

// Merchant
export type Merchant = Database['public']['Tables']['merchants']['Row'];
export type Merchants = Merchant[];

// Achievement
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type Achievements = Achievement[];

// Transaction
export type Transaction =
  Database['public']['Tables']['transactions_history']['Row'];

// Success types
export type SuccessResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};
