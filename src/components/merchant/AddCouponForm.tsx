'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  Controller,
} from 'react-hook-form';
import PerxInput from '../custom/PerxInput';
import { motion } from 'framer-motion';
import PerxDateRange from '../custom/PerxDateRange';
import PerxTextarea from '../custom/PerxTextarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoaderCircle } from 'lucide-react';
import PerxColors from '../custom/PerxColors';
import PerxSelect from '../custom/PerxSelect';
import { Checkbox } from '../ui/checkbox';
import { PerxDatalist } from '../custom/PerxDatalist';
import { toast } from 'sonner';
import { addCoupon } from '@/actions/coupon';

import { type AddCouponInputs, addCouponSchema } from '@/lib/couponSchema';
import type { CouponCategories, Ranks } from '@/lib/types';

export default function AddCouponForm({
  ranks,
  categories,
}: {
  ranks: Ranks;
  categories: CouponCategories;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddCouponInputs>({
    resolver: zodResolver(addCouponSchema),
    defaultValues: {
      allowPointsPurchase: false,
      allowLimitedPurchase: false,
      dateRange: { start: null, end: null },
    },
  });

  useEffect(() => {
    console.log('Errors:', errors);
  }, [errors]);

  const processForm: SubmitHandler<AddCouponInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Form data:', data);
      const response = await addCoupon(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast('Coupon added successfully! 🥳');
      // reset();
      // setImagePreview(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        (error as { message: string }).message ||
          'An error occurred while adding the coupon.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-8 flex h-auto w-full max-w-[800px] flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit((data) => {
            console.log('Form data:', data);
            processForm(data);
          })(e);
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
          control={control}
          ranks={ranks}
          categories={categories}
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
  control,
  ranks,
  categories,
}: {
  register: UseFormRegister<AddCouponInputs>;
  errors: FieldErrors<AddCouponInputs>;
  watch: (name: keyof AddCouponInputs) => any;
  setValue: (name: keyof AddCouponInputs, value: any) => void;
  isSubmitting: boolean;
  setImagePreview: (value: string | null) => void;
  imagePreview: string | null;
  control: any;
  ranks: Ranks;
  categories: CouponCategories;
}) {
  const allowLimitedPurchase = watch('allowLimitedPurchase');
  const allowPointsPurchase = watch('allowPointsPurchase');

  // Clear dateRange when allowLimitedPurchase is false
  useEffect(() => {
    if (!allowLimitedPurchase) {
      setValue('dateRange', { start: null, end: null });
    }
  }, [allowLimitedPurchase, setValue]);

  // Clear pointsAmount when allowPointsPurchase is false
  useEffect(() => {
    if (!allowPointsPurchase) {
      setValue('pointsAmount', undefined);
    }
  }, [allowPointsPurchase, setValue]);

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

  const colors: {
    name: string;
    primary: string;
    secondary: string;
  }[] = [
    { name: 'blue', primary: 'perx-blue', secondary: 'perx-cloud' },
    { name: 'green', primary: 'perx-canopy', secondary: 'perx-lime' },
    { name: 'gold', primary: 'perx-gold', secondary: 'perx-yellow' },
    { name: 'orange', primary: 'perx-rust', secondary: 'perx-orange' },
    { name: 'pink', primary: 'perx-azalea', secondary: 'perx-pink' },
    { name: 'navy', primary: 'perx-navy', secondary: 'perx-ocean' },
  ];

  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-perx- flex flex-col gap-5"
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
        <PerxDatalist
          options={categories.map((category) => ({
            value: category.category,
            label: category.description,
          }))}
          label="Category"
          required
          {...register('category')}
        />
        {errors.category?.message && (
          <ErrorMessage
            message={'Invalid category. Select from the given list only.'}
          />
        )}
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
          step="0.01"
          min={0}
          required
          {...register('price', {
            valueAsNumber: true,
            onChange: (e) => {
              const value = parseFloat(e.target.value);
              setValue('price', parseFloat(value.toFixed(2)));
            },
          })}
        />
        {errors.price?.message && (
          <ErrorMessage message={errors.price.message} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PerxInput
          label="Quantity"
          type="number"
          placeholder="0"
          min={1}
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
            className="border-input aspect-video h-64 w-auto rounded-md border object-cover"
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

      <div className="flex flex-col gap-1">
        <Controller
          name="accentColor" // Field name for react-hook-form
          control={control}
          defaultValue="perx-blue" // Default value
          render={({ field }) => (
            <PerxColors
              colors={colors}
              label="Accent color"
              value={field.value} // Controlled value
              onChange={field.onChange} // Controlled onChange handler
            />
          )}
        />
        {errors.accentColor?.message && (
          <ErrorMessage message={errors.accentColor.message} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Controller
          name="rankAvailability" // Field name for react-hook-form
          control={control}
          defaultValue={1} // Default value
          rules={{ required: 'Required' }} // Validation rules
          render={({ field, fieldState }) => (
            <>
              <PerxSelect
                label="Consumer Rank availability"
                description="Select which consumers can avail this coupon."
                options={ranks.map(({ id, rank, icon }) => ({
                  id: id.toString(),
                  title: rank,
                  icon,
                }))}
                value={field.value.toString()} // Controlled value
                onValueChange={(value) => field.onChange(Number(value))} // Controlled onChange handler
              />
              {errors.rankAvailability?.message && (
                <ErrorMessage message={errors.rankAvailability.message} />
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="allowPointsPurchase"
          control={control}
          defaultValue={false} // Default value
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="allowPointsPurchase"
                checked={field.value} // Controlled value
                onCheckedChange={field.onChange} // Controlled onChange handler
              />
              <Label
                htmlFor="allowPointsPurchase"
                className="mt-[1px] cursor-pointer text-sm"
              >
                Allow points purchase
              </Label>
            </div>
          )}
        />
        {allowPointsPurchase && (
          <div className="flex flex-col gap-1">
            <PerxInput
              label="Amount of points"
              type="number"
              placeholder="0.00"
              step="0.01"
              min={0}
              {...register('pointsAmount', {
                valueAsNumber: true,
                onChange: (e) => {
                  const value = parseFloat(e.target.value);
                  setValue('pointsAmount', parseFloat(value.toFixed(2)));
                },
              })}
            />
            {errors.pointsAmount?.message && (
              <ErrorMessage message={errors.pointsAmount.message} />
            )}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        <Controller
          name="allowLimitedPurchase"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="allowLimitedPurchase"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label
                htmlFor="allowLimitedPurchase"
                className="mt-[1px] cursor-pointer text-sm"
              >
                Limit purchase to a date range
              </Label>
            </div>
          )}
        />
        {allowLimitedPurchase && (
          <Controller
            name="dateRange"
            control={control}
            defaultValue={{ start: null, end: null }} // Default to null values
            render={({ field }) => (
              <div className="flex w-full flex-col gap-2">
                <PerxDateRange
                  value={field.value} // Pass strings or null
                  onChange={field.onChange} // Handle changes
                />
                <div className="flex flex-col">
                  {errors.dateRange?.start?.message && (
                    <ErrorMessage message={errors.dateRange.start.message} />
                  )}
                  {errors.dateRange?.end?.message && (
                    <ErrorMessage message={errors.dateRange.end.message} />
                  )}
                  {errors.dateRange?.message && (
                    <ErrorMessage message={errors.dateRange.message} />
                  )}
                </div>
              </div>
            )}
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="allowRepeatPurchase"
          control={control}
          defaultValue={false} // Default value
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="allowRepeatPurchase"
                checked={field.value} // Controlled value
                onCheckedChange={field.onChange} // Controlled onChange handler
              />
              <Label
                htmlFor="allowRepeatPurchase"
                className="mt-[1px] cursor-pointer text-sm"
              >
                Allow repeat purchase
              </Label>
            </div>
          )}
        />
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
