import { z } from 'zod';

// Merchant signup schemas and types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const Step1Schema = z
  .object({
    businessName: z.string().nonempty('Business name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const Step2Schema = z.object({
  description: z.string().nonempty('Description is required'),
  address: z.string().nonempty('Address is required'),
});

export const Step3Schema = z.object({
  logo: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
    .refine((files) => files?.length > 0, {
      message: 'Logo is required',
      path: ['logo'],
    })
    .refine(
      (files) => {
        const file = files[0];
        return file.size < 3000000;
      },
      {
        message: 'Logo must be less than 3MB',
        path: ['logo'],
      }
    )
    .refine(
      (files) => {
        const file = files[0];
        return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      {
        message: 'Only JPG, JPEG, and PNG formats are accepted',
        path: ['logo'],
      }
    ),
});

export type Step1Inputs = z.infer<typeof Step1Schema>;
export type Step2Inputs = z.infer<typeof Step2Schema>;
export type Step3Inputs = z.infer<typeof Step3Schema>;
export type MerchantFormInputs = Step1Inputs & Step2Inputs & Step3Inputs;

// Merchant login schemas and types
export const loginMerchantSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export type LoginMerchantInputs = z.infer<typeof loginMerchantSchema>;

// Merchant edit profile schemas and types
export const editProfileSchema = z.object({
  name: z.string().nonempty('Business name is required'),
  bio: z.string().nonempty('Description is required'),
  address: z.string().nonempty('Address is required'),
  // logo: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
  //   .refine((files) => files?.length > 0, {
  //     message: 'Logo is required',
  //     path: ['logo'],
  //   })
  //   .refine(
  //     (files) => {
  //       const file = files[0];
  //       return file.size < 3000000;
  //     },
  //     {
  //       message: 'Logo must be less than 3MB',
  //       path: ['logo'],
  //     }
  //   )
  //   .refine(
  //     (files) => {
  //       const file = files[0];
  //       return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
  //     },
  //     {
  //       message: 'Only JPG, JPEG, and PNG formats are accepted',
  //       path: ['logo'],
  //     }
  //   ),
});

export type EditProfileInputs = z.infer<typeof editProfileSchema>;

// Change password schemas and types
export const changePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;
