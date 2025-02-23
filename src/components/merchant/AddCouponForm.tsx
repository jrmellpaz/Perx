'use client';

import { AddCouponInputs, addCouponSchema } from '@/lib/merchant/couponSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import type { DateValue } from 'react-aria-components';

import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import PerxAlert from '../custom/PerxAlert';
import PerxInput from '../custom/PerxInput';
import { motion } from 'framer-motion';
import PerxDateRange from '../custom/PerxDateRange';
import PerxTextarea from '../custom/PerxTextarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoaderCircle } from 'lucide-react';
import { addCoupon } from '@/actions/merchant/coupon';

export default function AddCouponForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddCouponInputs>({
    resolver: zodResolver(addCouponSchema),
  });

  useEffect(() => {
    console.log('Validation Errors:', errors);
  }, [errors]);

  const processForm: SubmitHandler<AddCouponInputs> = async (data) => {
    console.log('Form submission started');
    setIsSubmitting(true);
    setSuccessMessage(null);
    setSubmitError(null);
    console.log('Form submitted with:', data);
    try {
      console.log('Submitting data:', data);
      console.log('Image file before submission:', imageFile);

      const response = await addCoupon(data);
      console.log('Response from addCoupon:', response);

      setSuccessMessage('Coupon added successfully! 🥳');
      reset();
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Failed to submit coupon. Please try again.');
    } finally {
      console.log('Form submission finished');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-8 flex w-full max-w-[800px] flex-col gap-6">
      {submitError && (
        <PerxAlert
          heading="Something went wrong 😢"
          message={submitError}
          variant="error"
        />
      )}
      {successMessage && (
        <PerxAlert heading={successMessage} variant="success" />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submission triggered!');

          console.log('Calling handleSubmit...');
          handleSubmit((data) => {
            console.log('Inside handleSubmit callback, received data:', data);
            processForm(data);
          })(e);
          console.log('After handleSubmit call.');
        }}
      >
        <Inputs
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          isSubmitting={isSubmitting}
          setImagePreview={setImagePreview}
          imagePreview={imagePreview}
          setImageFile={setImageFile}
        />
      </form>
    </section>
  );
}

function Inputs({
  register,
  errors,
  watch,
  setValue,
  isSubmitting,
  setImagePreview,
  imagePreview,
  setImageFile, // Receive setImageFile prop
}: {
  register: UseFormRegister<AddCouponInputs>;
  errors: FieldErrors<AddCouponInputs>;
  watch: (name: keyof AddCouponInputs) => any;
  setValue: (name: keyof AddCouponInputs, value: any) => void;
  isSubmitting: boolean;
  setImagePreview: (value: string | null) => void;
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
}) {
  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    register('validFrom', { required: 'Required' });
    register('validTo', { required: 'Required' });
  }, [register]);

  const handleDateChange = (
    value: { start: DateValue; end: DateValue } | null
  ) => {
    if (value) {
      setValue('validFrom', value.start.toString());
      setValue('validTo', value.end.toString());
    }
  };

  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <PerxInput
          label="Title"
          type="text"
          placeholder="Coupon X"
          required
          autofocus={true}
          {...register('title')}
        />
        {errors.title?.message && (
          <ErrorMessage message={errors.title.message} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PerxInput
          label="Type"
          type="text"
          placeholder="Type"
          required
          {...register('type')}
        />
        {errors.type?.message && <ErrorMessage message={errors.type.message} />}
      </div>

      <div className="flex flex-col gap-1">
        <PerxTextarea
          label="Description"
          placeholder="Coupon description"
          required
          {...register('description')}
        />
        {errors.description?.message && (
          <ErrorMessage message={errors.description.message} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PerxInput
          label="Price"
          type="number"
          placeholder="0.00"
          step="any"
          required
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price?.message && (
          <ErrorMessage message={errors.price.message} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PerxDateRange onChange={handleDateChange} />
      </div>

      <div className="flex flex-col gap-1">
        <PerxInput
          label="Quantity"
          type="number"
          placeholder="0"
          required
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity?.message && (
          <ErrorMessage message={errors.quantity.message} />
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Your coupon image"
            className="border-input aspect-square size-48 border object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Attach your coupon image"
          {...register('image')}
          required={imagePreview === null ? true : false}
        />
        {errors.image?.message && (
          <ErrorMessage
            message={
              typeof errors.image.message === 'string'
                ? errors.image.message
                : 'Something went wrong'
            }
          />
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
              Add coupon
            </>
          ) : (
            'Add coupon'
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
