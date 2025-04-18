'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { purchaseCoupon } from '@/actions/purchase';

import type { Coupon } from '@/lib/types';

type FormInputs = {
  paymentMethod: 'points' | 'cash';
};

export function PerxTicketSubmit({ coupon }: { coupon: Coupon }) {
  const { allowPointsPurchase, accentColor } = coupon;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, setValue } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    try {
      await purchaseCoupon(coupon, data.paymentMethod);
      toast('Coupon purchased successfully');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase coupon. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4"
    >
      {allowPointsPurchase && (
        <button
          type="submit"
          onClick={() => setValue('paymentMethod', 'points')}
          disabled={isLoading}
          className={cn(
            `flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium`,
            isLoading && 'opacity-50'
          )}
          style={{
            border: `1px solid ${getPrimaryAccentColor(accentColor)}`,
            color: getPrimaryAccentColor(accentColor),
          }}
        >
          Purchase with Points
        </button>
      )}
      <button
        type="submit"
        onClick={() => setValue('paymentMethod', 'cash')}
        disabled={isLoading}
        className={cn(
          `flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium`,
          isLoading && 'opacity-50'
        )}
        style={{
          backgroundColor: getPrimaryAccentColor(accentColor),
          color: getAccentColor(accentColor),
        }}
      >
        Pay with Cash
      </button>
      <input type="hidden" {...register('paymentMethod')} />
    </form>
  );
}
