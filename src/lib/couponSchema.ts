import { z } from 'zod';
import { Constants } from './database.types';

// Coupon insert schemas and types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_IMAGE_SIZE_MB = 3;
//   'Technology & Electronics',
//   'Fashion & Apparel',
//   'Health, Beauty, & Wellness',
//   'Home & Living',
//   'Automotive',
//   'Toys & Hobbies',
//   'Pets',
//   'Entertainment & Leisure',
//   'Travel & Tourism',
//   'Education & Learning',
//   'Professional Services',
//   'Transportation & Delivery',
//   'Events & Celebration',
//   'Sports & Fitness',
//   'Internet & Telecom',
//   'Subscription & Membership',
//   'Baby & Maternity',
//   'Office & Business',
//   'Hardware & Tools',
//   'Luxury Goods',
//   'Seasonal & Holiday Offers',
// ]);

export const couponCategories = Constants.public.Enums.coupon_category;
const couponCategoriesEnum = z.enum(couponCategories);

const colors = Constants.public.Enums.color;
const ColorEnum = z.enum(colors);

export const addCouponSchema = z
  .object({
    title: z.string().nonempty('Title is required'),
    category: couponCategoriesEnum,
    description: z.string().nonempty('Description is required'),
    originalPrice: z
      .number({ message: 'Original price is required.' })
      .positive('Original price must be greater than 0'),
    discountedPrice: z.preprocess(
      (val) => {
        const parsed = Number(val);
        return isNaN(parsed) ? 0 : parsed;
      },
      z.number()
        .min(0, 'Discounted Price cannot be negative')
        .optional()
    ),
    quantity: z
      .number({ message: 'Quantity is required.' })
      .int()
      .positive('Quantity must be greater than 0'),
    allowLimitedPurchase: z.boolean().default(false),
    dateRange: z
      .object({
        start: z.union([z.string().datetime('Invalid start date'), z.null()]),
        end: z.union([z.string().datetime('Invalid end date'), z.null()]),
      })
      .nullable()
      .optional(),
    image: z
      .any()
      .refine((files) => files && files.length > 0, {
        message: 'Image is required',
      })
      .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type), {
        message: 'Invalid image type. Accepted types are JPEG, JPG, and PNG.',
      })
      .refine((files) => files[0].size <= MAX_IMAGE_SIZE_MB * 1024 * 1024, {
        message: `Image size should be less than ${MAX_IMAGE_SIZE_MB}MB.`,
      }),
    accentColor: ColorEnum.default('perx-blue'),
    // allowPointsPurchase: z.boolean().default(false),

    pointsAmount: z.preprocess(
      (val) => {
        const parsed = Number(val);
        return isNaN(parsed) ? 0 : parsed;
      },
      z.number()
        .min(0, 'Discounted Price cannot be negative')
        .optional()
    ),

    maxPurchaseLimitPerUser: z.preprocess(
      (val) => {
        const parsed = Number(val);
        return isNaN(parsed) ? 1 : parsed;
      },
      z.number().int().positive('Maximum purchase per limit must be greater than 0').optional()
    ),

    rankAvailability: z.number().int().default(1),
    redemptionValidity: z.preprocess(
      (val) => {
        const parsed = Number(val);
        return isNaN(parsed) ? 7 : parsed;
      },
      z.number().int().positive('Redemption validity must be greater than 0').optional()
    ),
  })
  .refine(
    (data) => {
      // If dateRange is null or undefined, it's valid
      if (!data.dateRange) return true;
      
      // If dateRange exists, both start and end must be provided
      if (data.dateRange.start && data.dateRange.end) return true;
      
      // If only one date is provided, it's invalid
      return !data.dateRange.start && !data.dateRange.end;
    },
    {
      message: 'Both start and end dates must be provided together',
      path: ['dateRange'],
    }
  )
  // .refine(
  //   (data) =>
  //     ( data.dateRange?.start !== null &&
  //       data.dateRange?.end !== null),
  //   {
  //     message: 'Date range is required when limited purchase is enabled.',
  //     path: ['dateRange'],
  //   }
  // )
  // .refine(
  //   (data) =>
  //     !data.allowPointsPurchase ||
  //     (data.allowPointsPurchase && data.pointsAmount !== undefined),
  //   {
  //     message: 'Points amount is required when points purchase is enabled.',
  //     path: ['pointsAmount'],
  //   }
  // );

export type AddCouponInputs = z.infer<typeof addCouponSchema>;
