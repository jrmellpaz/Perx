'use client';

import { AddCouponInputs, addCouponSchema } from '@/lib/merchant/couponSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import PerxAlert from '../custom/PerxAlert';
import PerxInput from '../custom/PerxInput';
import { motion } from 'framer-motion';

export default function AddCouponForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AddCouponInputs>({
    resolver: zodResolver(addCouponSchema),
  });

  const processForm: SubmitHandler<AddCouponInputs> = async () => {
    // Process form data
  };

  return (
    <section className="mt-8 w-full max-w-[800px]">
      {submitError && (
        <PerxAlert
          heading={'Something went wrong 😢'}
          message="Make sure your inputs are correct."
          variant="error"
        />
      )}
      <form onSubmit={handleSubmit(processForm)}>
        <Inputs register={register} errors={errors} />
      </form>
    </section>
  );
}

function Inputs({
  register,
  errors,
}: {
  register: UseFormRegister<AddCouponInputs>;
  errors: FieldErrors<AddCouponInputs>;
}) {
  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
        <PerxInput
          label="Price"
          type="number"
          placeholder="0.00"
          required
          {...register('price')}
        />
        {errors.price?.message && (
          <ErrorMessage message={errors.price.message} />
        )}
      </div>
      <div className="flex flex-col gap-2"></div>
    </motion.div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
