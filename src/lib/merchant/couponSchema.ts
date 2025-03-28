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
    category: couponCategories,
    description: z.string().nonempty('Description is required'),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Invalid price',
      })
      .positive('Invalid price'),
    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Invalid quantity',
      })
      .int('Invalid quantity')
      .positive('Quantity must be greater than 0'),
    allowLimitedPurchase: z.boolean().default(false),
    validFrom: z
      .union([z.string().datetime(), z.literal('')]) // Allow datetime string or empty string
      .optional(),
    validTo: z
      .union([z.string().datetime(), z.literal('')]) // Allow datetime string or empty string
      .optional(),
    image: z
      .any()
      .refine((files) => files?.length > 0, {
        message: 'Image is required',
        path: ['image'],
      })
      .refine(
        (files) => {
          const file = files[0];
          return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        {
          message: 'Only JPG, JPEG, and PNG formats are accepted',
          path: ['image'],
        }
      ),
    accentColor: z.string().default('perx-blue'),
    consumerRankAvailability: z.string().default('1'),
    allowPointsPurchase: z.boolean().default(false),
    pointsAmount: z
      .number({
        invalid_type_error: 'Invalid amount of points',
      })
      .positive('Invalid amount of points')
      .optional(),
  })
  .refine(
    (data) =>
      !data.allowPointsPurchase ||
      (data.allowPointsPurchase && data.pointsAmount !== undefined),
    {
      message: 'Points amount is required when points purchase is allowed.',
      path: ['pointsAmount'],
    }
  )
  .refine(
    (data) => {
      if (data.allowLimitedPurchase) {
        // When allowLimitedPurchase is true, validFrom and validTo must be valid dateTime strings
        return (
          typeof data.validFrom === 'string' &&
          typeof data.validTo === 'string' &&
          data.validFrom !== '' &&
          data.validTo !== ''
        );
      } else {
        // When allowLimitedPurchase is false, validFrom and validTo must be empty strings
        return data.validFrom === '' && data.validTo === '';
      }
    },
    {
      message:
        'When allowLimitedPurchase is true, validFrom and validTo must be valid dateTime strings. When false, they must be empty strings.',
      path: ['validFrom', 'validTo'], // Attach the error to these fields
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
};
