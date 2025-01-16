import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const MerchantFormDataSchema = z
  .object({
    businessName: z.string().nonempty('Business name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
    description: z.string().nonempty('Description is required'),
    address: z.string().nonempty('Address is required'),
    logo: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
      .refine((files) => files?.length > 0, 'Logo is required')
      .refine((files) => {
        const file = files[0];
        return file.size < 5000000;
      }, 'Logo must be less than 5MB')
      .refine((files) => {
        const file = files[0];
        return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, 'Only JPG, JPEG, and PNG formats are accepted'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );
