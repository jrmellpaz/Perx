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
import { PerxDatalist } from '../custom/PerxDatalist';
import { toast } from 'sonner';
import { addCoupon } from '@/actions/coupon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';

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
  const [showPointsOnlyDialog, setShowPointsOnlyDialog] = useState(false);
  const [showNoDiscountDialog, setShowNoDiscountDialog] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<AddCouponInputs | null>(null);

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
      dateRange: { start: null, end: null },
    },
  });

  useEffect(() => {
    console.log('Errors:', errors);
  }, [errors]);

  const processForm: SubmitHandler<AddCouponInputs> = async (data) => {
    // Check if discounted price is 0 but original price exists
    const hasNoDiscount =
      data.originalPrice > 0 &&
      (!data.discountedPrice || data.discountedPrice === 0);
    // Check if this is a points-only coupon
    const isPointsOnly =
      data.pointsAmount &&
      data.pointsAmount > 0 &&
      (!data.cashAmount || data.cashAmount === 0);

    if (hasNoDiscount && !pendingFormData) {
      setPendingFormData(data);
      setShowNoDiscountDialog(true);
      return;
    }

    if (isPointsOnly && !pendingFormData) {
      setPendingFormData(data);
      setShowPointsOnlyDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Form data:', data);
      const response = await addCoupon(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast('Coupon added successfully! 🥳');
      reset();
      setImagePreview(null);
      setPendingFormData(null);
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

  const handleDialogClose = (type: 'points' | 'discount') => {
    if (type === 'discount') {
      setShowNoDiscountDialog(false);
    } else {
      setShowPointsOnlyDialog(false);
    }
    setPendingFormData(null);
  };

  const handleConfirm = (type: 'points' | 'discount') => {
    if (pendingFormData) {
      processForm(pendingFormData);
    }
    if (type === 'discount') {
      setShowNoDiscountDialog(false);
    } else {
      setShowPointsOnlyDialog(false);
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

      <Dialog
        open={showPointsOnlyDialog}
        onOpenChange={() => handleDialogClose('points')}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Points-Only Coupon</DialogTitle>
            <DialogDescription>
              You are creating a coupon that can only be purchased with points
              (no cash price). This means consumers will use only their points
              to acquire this coupon. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogClose('points')}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm('points')}
              type="button"
              className="bg-perx-blue"
            >
              Yes, Create Points-Only Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNoDiscountDialog}
        onOpenChange={() => handleDialogClose('discount')}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Discounted Price Specified</DialogTitle>
            <DialogDescription>
              You have not specified a discounted price. The discounted price
              will be set to ₱0.00, and the original price (₱
              {pendingFormData?.originalPrice?.toFixed(2)}) will be used as the
              selling price. Would you like to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogClose('discount')}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm('discount')}
              type="button"
              className="bg-perx-blue"
            >
              Yes, use original price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      <div className="flex flex-col gap-8 rounded-lg bg-white px-4 py-6 shadow-md md:p-12">
        <h1 className="font-mono text-xl font-medium">Coupon details</h1>
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
            label="Original price"
            type="number"
            placeholder="0.00"
            step="0.01"
            min={0}
            required
            {...register('originalPrice', {
              valueAsNumber: true,
              onChange: (e) => {
                const value = parseFloat(e.target.value);
                setValue('originalPrice', parseFloat(value.toFixed(2)));
              },
            })}
          />
          {errors.originalPrice?.message && (
            <ErrorMessage message={errors.originalPrice.message} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <PerxInput
            label="Discounted price (Optional)"
            type="number"
            placeholder="0.00"
            step="0.01"
            min={0}
            {...register('discountedPrice', {
              valueAsNumber: true,
              onChange: (e) => {
                const value = parseFloat(e.target.value);
                setValue('discountedPrice', parseFloat(value.toFixed(2)));
              },
            })}
          />
          {errors.discountedPrice?.message && (
            <ErrorMessage message={errors.discountedPrice.message} />
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
      </div>
      <div className="flex flex-col gap-6 rounded-lg bg-white px-4 py-6 shadow-md md:p-12">
        <h1 className="font-mono text-xl font-medium">Coupon design</h1>
        {imagePreview && (
          <div className="flex flex-col items-center justify-center">
            <img
              src={imagePreview}
              alt="Your coupon image"
              className="border-input aspect-video h-64 w-auto rounded-md border object-cover"
            />
          </div>
        )}

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
      </div>

      <div className="flex flex-col gap-6 rounded-lg bg-white px-4 py-6 shadow-md md:p-12">
        <h1 className="font-mono text-xl font-medium">
          Purchase & redemption details
        </h1>
        <div className="flex flex-col gap-1">
          <PerxInput
            label="Quantity per user"
            type="number"
            description="Maximum number of coupons a user can buy."
            placeholder="0"
            defaultValue={1}
            min={1}
            {...register('maxPurchaseLimitPerUser', { valueAsNumber: true })}
          />
          {errors.maxPurchaseLimitPerUser?.message && (
            <ErrorMessage message={errors.maxPurchaseLimitPerUser.message} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <PerxInput
            label="Redemption validity in days"
            type="number"
            defaultValue={7}
            description="Number of days this coupon can be redeemed after purchase."
            placeholder="0"
            min={1}
            {...register('redemptionValidity', { valueAsNumber: true })}
          />
          {errors.redemptionValidity?.message && (
            <ErrorMessage message={errors.redemptionValidity.message} />
          )}
        </div>
        <div className="flex flex-col gap-5">
          <Label>Alternative payment option: Points + Cash</Label>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <PerxInput
                label="Points (Optional)"
                description="Amount of points consumers will pay in exchange for a lowered price if they choose to pay with Points + Cash."
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
            <div className="flex flex-col gap-1">
              <PerxInput
                label="Adjusted price (Optional)"
                description="Adjusted amount consumers will pay if they choose to pay with Points + Cash."
                type="number"
                placeholder="0.00"
                step="0.01"
                min={0}
                {...register('cashAmount', {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = parseFloat(e.target.value);
                    setValue('cashAmount', parseFloat(value.toFixed(2)));
                  },
                })}
              />
              {errors.pointsAmount?.message && (
                <ErrorMessage message={errors.pointsAmount.message} />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="date">Purchase date range </Label>
            <p className="text-muted-foreground/70 text-xs">
              This coupon won't be visible until the specified date.
            </p>
          </div>
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
        </div>
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
              Creating coupon
            </>
          ) : (
            'Create coupon'
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
