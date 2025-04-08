'use client';

import { purchaseCoupon } from '@/actions/consumer/coupon';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

type FormInputs = {
  paymentMethod: 'points' | 'cash';
};

export function PerxTicketSubmit({
  allowPointsPurchase,
  accentColor,
  couponId,
}: {
  allowPointsPurchase: boolean;
  accentColor: string;
  couponId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, setValue } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    try {
      // Call the purchase function with the selected payment method
      await purchaseCoupon(couponId, data.paymentMethod);
      toast('Coupon purchased successfully');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase coupon. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      {allowPointsPurchase && (
        <button
          type="submit"
          onClick={() => setValue('paymentMethod', 'points')} // Set payment method to 'points'
          disabled={isLoading}
          className={`flex-1 rounded-lg border text-${accentColor} border-${accentColor} px-4 py-2 text-sm font-medium hover:bg-${accentColor}/50 cursor-pointer`}
        >
          Purchase with Points
        </button>
      )}
      <button
        type="submit"
        onClick={() => setValue('paymentMethod', 'cash')} // Set payment method to 'cash'
        disabled={isLoading}
        className={`bg-${accentColor} hover:bg-${accentColor}/70 text-perx-white flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium`}
      >
        Pay with Cash
      </button>
      {/* Hidden input to track the selected payment method */}
      <input type="hidden" {...register('paymentMethod')} />
    </form>
  );
}
