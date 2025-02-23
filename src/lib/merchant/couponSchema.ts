import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const addCouponSchema = z.object({
  title: z.string().nonempty('Title is required'),
  type: z.string().nonempty('Type is required'),
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
    .positive('Quanity must be greater than 0'),
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
});

export type AddCouponInputs = z.infer<typeof addCouponSchema>;
