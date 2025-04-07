import { z } from 'zod';

export type ConsumerProfile = {
  name: string;
  interests: string[];
  referralCode: string;
  rank:
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
  balancePoints: number;
  totalPoints: number;
};

export const editProfileSchema = z.object({
  name: z.string().nonempty('Name is required'),
  interests: z.array(z.string()).optional(),
});

export type EditProfileInputs = z.infer<typeof editProfileSchema>;
