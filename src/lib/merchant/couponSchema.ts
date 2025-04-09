import { fetchCouponCategories } from '@/actions/merchant/coupon';
import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const couponCategories = z.enum([
  'Hardware & Tools',
  'Transportation & Delivery',
  'Luxury Goods',
  'Health, Beauty, & Wellness',
  'Automotive',
  'Office & Business',
  'Travel & Tourism',
  'Sports & Fitness',
  'Internet & Telecom',
  'Seasonal & Holiday Offers',
  'Technology & Electronics',
  'Entertainment & Leisure',
  'Food & Beverage',
  'Baby & Maternity',
  'Home & Living',
  'Subscription & Membership',
  'Toys & Hobbies',
  'Fashion & Apparel',
  'Professional Services',
  'Events & Celebration',
  'Pets',
]);

export const addCouponSchema = z
  .object({
    title: z.string().nonempty('Title is required'),
    category: z.string().nonempty('Category is required'),
    description: z.string().nonempty('Description is required'),
    price: z.number().positive('Price must be greater than 0'),
    quantity: z.number().int().positive('Quantity must be greater than 0'),
    allowLimitedPurchase: z.boolean().default(false),
    dateRange: z
      .object({
        start: z.union([z.string().datetime('Invalid start date'), z.null()]),
        end: z.union([z.string().datetime('Invalid end date'), z.null()]),
      })
      .optional(), // Initially optional
    image: z.any().optional(),
    accentColor: z.string().default('perx-blue'),
    allowPointsPurchase: z.boolean().default(false),
    pointsAmount: z
      .number()
      .positive('Points amount must be greater than 0')
      .optional(), // Initially optional
    allowRepeatPurchase: z.boolean().default(false),
    consumerRankAvailability: z
      .enum([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
      ])
      .default('1'), // Default to rank '1'
  })
  .refine(
    (data) =>
      !data.allowLimitedPurchase ||
      (data.allowLimitedPurchase &&
        data.dateRange?.start !== null &&
        data.dateRange?.end !== null),
    {
      message: 'Date range is required when limited purchase is enabled.',
      path: ['dateRange'], // Attach the error to the dateRange field
    }
  )
  .refine(
    (data) =>
      !data.allowPointsPurchase ||
      (data.allowPointsPurchase && data.pointsAmount !== undefined),
    {
      message: 'Points amount is required when points purchase is enabled.',
      path: ['pointsAmount'], // Attach the error to the pointsAmount field
    }
  );

export type AddCouponInputs = z.infer<typeof addCouponSchema>;
export type CouponCategory = {
  category: string;
  description: string;
};
export type MerchantCoupon = {
  id: string;
  merchantId: string;
  description: string;
  price: number;
  allowLimitedPurchase: boolean;
  validFrom: string;
  validTo: string;
  isDeactivated: boolean;
  image: string;
  title: string;
  quantity: number;
  category: string;
  accentColor:
    | 'perx-blue'
    | 'perx-canopy'
    | 'perx-gold'
    | 'perx-rust'
    | 'perx-azalea'
    | 'perx-navy';
  consumerAvailability:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '13'
    | '14'
    | '15';
  allowPointsPurchase: boolean;
  pointsAmount: number | null;
  allowRepeatPurchase: boolean;
};
