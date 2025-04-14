'use client';

import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxTextarea from '../custom/PerxTextarea';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { updateMerchantProfile } from '@/actions/merchantProfile';
import { redirect } from 'next/navigation';

import type { Merchant } from '@/lib/types';
import {
  type EditProfileInputs,
  editProfileSchema,
} from '@/lib/merchantSchema';

export default function MerchantEditProfile({
  profile,
}: {
  profile: Merchant;
}) {
  const { name, bio, address, logo } = profile;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: name,
      bio: bio ?? '',
      address: address ?? '',
    },
  });

  const processForm: SubmitHandler<EditProfileInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateMerchantProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
      redirect('/merchant/profile/coupons');
    }
  };

  return (
    <main className="flex w-full flex-col items-center">
      <form
        onSubmit={handleSubmit(processForm)}
        className="my-2 flex w-full max-w-[800px] flex-col gap-8"
      >
        <EditLogo logo={logo} register={register} errors={errors} />
        <EditDetails
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </form>
    </main>
  );
}

function EditLogo({
  logo,
  register,
  errors,
}: {
  logo: string;
  register: UseFormRegister<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}) {
  const [previewLogo, setPreviewLogo] = useState<string>(logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={previewLogo}
        alt="Merchant profile photo"
        className="size-32 rounded-full border object-cover sm:size-48"
      />
      <PerxInput
        type="file"
        label=""
        accept="image/*"
        placeholder="Upload logo"
        className="hidden"
        {...register('logo', {
          onChange: (event) => {
            handleFileChange(event);
          },
        })}
        ref={(e) => {
          fileInputRef.current = e;
          register('logo').ref(e);
        }}
      />
      {errors.logo?.message && (
        <ErrorMessage message={String(errors.logo.message)} />
      )}
      <Button
        onClick={handleButtonClick}
        className="text-perx-blue hover:text-perx-blue"
        variant={'ghost'}
        type="button"
      >
        Change photo
      </Button>
    </div>
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
      <div>
        <PerxTextarea
          label="Business description"
          placeholder="Tell us about your business"
          required
          {...register('bio')}
        />
        {errors.bio?.message && <ErrorMessage message={errors.bio.message} />}
      </div>
      <div>
        <PerxInput
          label="Address"
          type="text"
          placeholder="123 Main St, Cebu City, Cebu 6000"
          required
          {...register('address')}
        />
        {errors.address?.message && (
          <ErrorMessage message={errors.address.message} />
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
