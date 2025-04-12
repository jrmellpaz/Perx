import { fetchCouponCategories } from '@/actions/merchant/coupon';
import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const couponCategories = z.enum([
  'Food & Beverage',
  'Technology & Electronics',
  'Fashion & Apparel',
  'Health, Beauty, & Wellness',
  'Home & Living',
  'Automotive',
  'Toys & Hobbies',
  'Pets',
  'Entertainment & Leisure',
  'Travel & Tourism',
  'Education & Learning',
  'Professional Services',
  'Transportation & Delivery',
  'Events & Celebration',
  'Sports & Fitness',
  'Internet & Telecom',
  'Subscription & Membership',
  'Baby & Maternity',
  'Office & Business',
  'Hardware & Tools',
  'Luxury Goods',
  'Seasonal & Holiday Offers',
]);

const ColorEnum = z.enum([
  'perx-blue',
  'perx-canopy',
  'perx-gold',
  'perx-rust',
  'perx-azalea',
  'perx-navy',
  'perx-black',
  'perx-cloud',
  'perx-crimson',
  'perx-lime',
  'perx-ocean',
  'perx-orange',
  'perx-orchid',
  'perx-pink',
  'perx-sunset',
  'perx-yellow',
  'perx-zen',
  'perx-plum',
]);

export const addCouponSchema = z
  .object({
    title: z.string().nonempty('Title is required'), // NOT NULL
    category: couponCategories, // Enum from the database
    description: z.string().nonempty('Description is required'), // NOT NULL
    price: z.number().positive('Price must be greater than 0'), // NOT NULL
    quantity: z.number().int().positive('Quantity must be greater than 0'), // NOT NULL
    allowLimitedPurchase: z.boolean().default(false), // DEFAULT false
    dateRange: z
      .object({
        start: z.union([z.string().datetime('Invalid start date'), z.null()]), // NULLABLE
        end: z.union([z.string().datetime('Invalid end date'), z.null()]), // NULLABLE
      })
      .optional(), // Optional field
    image: z.any(), // NULLABLE, must be a valid URL
    accentColor: ColorEnum.default('perx-blue'), // Enum with DEFAULT 'perx-blue'
    allowPointsPurchase: z.boolean().default(false), // DEFAULT false
    pointsAmount: z
      .number()
      .positive('Points amount must be greater than 0')
      .optional(), // NULLABLE
    allowRepeatPurchase: z.boolean().default(false), // DEFAULT false
    rankAvailability: z.number().int().default(1), // DEFAULT 1
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
  id: string; // UUID, primary key
  merchantId: string; // Foreign key to merchants table
  description: string; // NOT NULL
  price: number; // NOT NULL
  allowLimitedPurchase: boolean; // DEFAULT false
  validFrom: string | null; // Corresponds to valid_from, NULLABLE
  validTo: string | null; // Corresponds to valid_to, NULLABLE
  isDeactivated: boolean; // Indicates if the coupon is deactivated
  image: string | null; // NULLABLE
  title: string; // NOT NULL
  quantity: number; // NOT NULL
  category: (typeof couponCategories._def.values)[number]; // Enum from database
  accentColor: (typeof ColorEnum._def.values)[number]; // Enum from database
  rankAvailability: string; // Corresponds to rank_availability, DEFAULT 1
  allowPointsPurchase: boolean; // DEFAULT false
  pointsAmount: number | null; // NULLABLE
  allowRepeatPurchase: boolean; // DEFAULT false
};
