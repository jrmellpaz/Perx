import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const addCouponSchema = z
  .object({
    title: z.string().nonempty('Title is required'),
    category: z.string().nonempty('Type is required'),
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
    validFrom: z.string().date(),
    validTo: z.string().date(),
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
  );

export type AddCouponInputs = z.infer<typeof addCouponSchema>;
export type CouponCategory = {
  category: string;
  description: string;
};
export type MerchantCoupon = {
  id: string;
  description: string;
  price: number;
  valid_from: string;
  valid_to: string;
  is_deactivated: boolean;
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
