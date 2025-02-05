import { z } from 'zod';

export const Step1Schema = z
  .object({
    name: z.string().nonempty('Name is required'),
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
  referralCode: z.string(),
});

export const Step3Schema = z
  .object({
    interests: z
      .array(z.string())
      .min(1, 'You must select at least one interest.'),
    otherInterests: z.array(z.string().min(1, 'Custom interest cannot be empty')).optional(),
  })
  .refine(
    (data) => !data.interests.includes('Others') || (data.otherInterests && data.otherInterests.length > 0),
    {
      message: "Please specify at least one custom interest if 'Others' is selected.",
      path: ['otherInterests'],
    }
  );

  export const loginConsumerSchema = z.object({
    email: z
      .string()
      .email('Invalid email address')
      .nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
  });

export type Step1Inputs = z.infer<typeof Step1Schema>;
export type Step2Inputs = z.infer<typeof Step2Schema>;
export type Step3Inputs = z.infer<typeof Step3Schema>;
export type LoginConsumerInputs = z.infer<typeof loginConsumerSchema>;

export type ConsumerFormInputs = Step1Inputs & Step2Inputs & Step3Inputs;
