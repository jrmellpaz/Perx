'use client';

import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  useFormContext,
  FormProvider,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxCheckbox from '../custom/PerxCheckbox';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateConsumerProfile } from '@/actions/consumerProfile';
import { redirect } from 'next/navigation';
import { couponCategories } from '@/lib/couponSchema';

import type { Consumer } from '@/lib/types';
import { EditProfileInputs, editProfileSchema } from '@/lib/consumerSchema';
import { toast } from 'sonner';

export default function ConsumerEditProfile({
  profile,
}: {
  profile: Consumer;
}) {
  const { name, interests } = profile;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formMethods = useForm<EditProfileInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: name,
      interests: interests ?? [],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  const processForm: SubmitHandler<EditProfileInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateConsumerProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
      toast.success('Profile updated successfully!');
      redirect('/profile');
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(processForm)}
        className="my-2 flex w-9/10 max-w-[800px] flex-col gap-8"
      >
        <EditDetails
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
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
    setInterests([...couponCategories]);
  }, [setValue]);

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
      className="flex w-full flex-col gap-6 bg-inherit"
    >
      <div className="bg-inherit">
        <PerxInput
          label="Name"
          type="text"
          placeholder="Juan Dela Cruz"
          required
          autofocus
          className="bg-inherit"
          labelClassName="bg-neutral-50"
          {...register('name')}
        />
        {errors.name?.message && <ErrorMessage message={errors.name.message} />}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono font-semibold">Interests</label>
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
