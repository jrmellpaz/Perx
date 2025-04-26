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
    price: z
      .number({ message: 'Price is required.' })
      .positive('Price must be greater than 0'),
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
    allowPointsPurchase: z.boolean().default(false),
    pointsAmount: z
      .number({
        message: 'Amount is required when points purchase is allowed.',
      })
      .positive('Points amount must be greater than 0')
      .optional(),
    allowRepeatPurchase: z.boolean().default(false),
    rankAvailability: z.number().int().default(1),
  })
  .refine(
    (data) =>
      !data.allowLimitedPurchase ||
      (data.allowLimitedPurchase &&
        data.dateRange?.start !== null &&
        data.dateRange?.end !== null),
    {
      message: 'Date range is required when limited purchase is enabled.',
      path: ['dateRange'],
    }
  )
  .refine(
    (data) =>
      !data.allowPointsPurchase ||
      (data.allowPointsPurchase && data.pointsAmount !== undefined),
    {
      message: 'Points amount is required when points purchase is enabled.',
      path: ['pointsAmount'],
    }
  );

export type AddCouponInputs = z.infer<typeof addCouponSchema>;
