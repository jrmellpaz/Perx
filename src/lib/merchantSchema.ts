import { z } from 'zod';

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
    logo: z
      .instanceof(FileList)
      .refine(
        (files) => files?.[0]?.size < 500000,
        "Logo size can't exceed 5MB"
      )
      .refine(
        (files) =>
          ['image/jpeg', 'image/jpg', 'image/png'].includes(files?.[0]?.type),
        'Only .jpg, .jpeg, and .png formats are supported'
      ),
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
