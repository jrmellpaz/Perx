import { z } from 'zod';

export type MerchantProfile = {
  name: string;
  email: string;
  bio: string;
  address: string;
  logo: string;
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const editProfileSchema = z.object({
  businessName: z.string().nonempty('Business name is required'),
  description: z.string().nonempty('Description is required'),
  address: z.string().nonempty('Address is required'),
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

export type EditProfileInputs = z.infer<typeof editProfileSchema>;
