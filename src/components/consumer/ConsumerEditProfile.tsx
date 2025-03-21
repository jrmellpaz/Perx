'use client';

import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  useFormContext,
} from 'react-hook-form';
import {
  EditProfileInputs,
  editProfileSchema,
  ConsumerProfile,
} from '@/lib/consumer/profileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxTextarea from '../custom/PerxTextarea';
import PerxCheckbox from '../custom/PerxCheckbox';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateConsumerProfile } from '@/actions/consumer/profile';
import { redirect } from 'next/navigation';
import { fetchTopCouponTypes } from '@/actions/consumer/auth';

export default function ConsumerEditProfile({
  profile,
}: {
  profile: ConsumerProfile;
}) {
  const { name, interests } = profile;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EditProfileInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: name,
      interests: interests,
    },
  });

  const processForm: SubmitHandler<EditProfileInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateConsumerProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
      redirect('/profile');
    }
  };

  return (
    <main className="flex w-full flex-col items-center">
      <form
        onSubmit={handleSubmit(processForm)}
        className="my-2 flex w-full max-w-[800px] flex-col gap-8"
      >
        <EditDetails
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </form>
    </main>
  );
}

function EditDetails({
  register,
  errors,
  isSubmitting,
}: {
  register: UseFormRegister<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
  isSubmitting: boolean;
}) {
  const [interests, setInterests] = useState<string[]>([]);
  const { setValue, watch } = useFormContext<EditProfileInputs>();
  const selectedInterests = watch('interests', []) || [];

  useEffect(() => {
    const loadCouponTypes = async () => {
      const topTypes = await fetchTopCouponTypes(); // Fetch available interests
      setInterests(topTypes);
    };
    loadCouponTypes();
  }, []);

  const handleCheckboxChange = (interest: string, checked: boolean) => {
    if (checked) {
      setValue('interests', [...selectedInterests, interest]);
    } else {
      setValue(
        'interests',
        selectedInterests.filter((item) => item !== interest)
      );
    }
  };

  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex w-full flex-col gap-6"
    >
      <div>
        <PerxInput
          label="Business name"
          type="text"
          placeholder="Business, Inc."
          required
          autofocus
          {...register('name')}
        />
        {errors.name?.message && <ErrorMessage message={errors.name.message} />}
      </div>

      {/* Interests Section */}
      <div>
        <label className="font-semibold">Interests</label>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <label key={interest} className="flex items-center gap-2">
              <PerxCheckbox
                label={interest}
                checked={selectedInterests.includes(interest)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(interest, checked)
                }
              />
            </label>
          ))}
        </div>
        {errors.interests?.message && (
          <ErrorMessage message={errors.interests.message} />
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-perx-blue transition-all"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                className="-ms-1 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Save changes
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </motion.div>
  );
}


function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
