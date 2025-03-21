import { z } from 'zod';

export type ConsumerProfile = {
  name: string;
  interests: string[];
  referral_code: string;
};

export const editProfileSchema = z.object({
  name: z.string().nonempty('Name is required'),
  interests: z.array(z.string()).optional(),
});

export type EditProfileInputs = z.infer<typeof editProfileSchema>;
