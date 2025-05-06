'use client';

import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import { purchaseCoupon } from '@/actions/purchase';
import { redeemCoupon } from '@/actions/coupon'; 

import type { Coupon } from '@/lib/types';

type FormInputs = {
  paymentMethod: 'points' | 'cash';
};

export function PerxTicketSubmit({
  coupon,
  qrToken,
}: {
  coupon: Coupon;
  qrToken?: string;
}) {
  const { allow_points_purchase, accent_color } = coupon;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [redeemed, setRedeemed] = useState<boolean>(!!isRedeemed);

  const { register, handleSubmit, setValue } = useForm<FormInputs>();
  const [isPending, startTransition] = useTransition();

  const handleRedeem = () => {
    if (!qrToken) 
      return toast.error('Missing QR token');

    startTransition(async () => {
      const result = await redeemCoupon(qrToken);

      if (result.success) {
        toast.success(result.message);
        // setRedeemed(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    try {
      const result = await purchaseCoupon(coupon, data.paymentMethod);

      if (result.success) {
        toast(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
        console.error('Purchase error:', error);
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {qrToken ? (
        <button
          type="button"
          disabled={isLoading || isPending}
          onClick={handleRedeem}
          className={cn(
            'w-full rounded-lg px-4 py-2 text-sm font-medium text-white',
            isLoading ? 'opacity-50' : '',
          )}
          style={{
            backgroundColor: getPrimaryAccentColor(accent_color),
            color: getAccentColor(accent_color),
          }}
        >
          {isLoading ? 'Redeeming...' : 'Redeem Coupon'}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4"
        >
          {allow_points_purchase && (
            <button
              type="submit"
              onClick={() => setValue('paymentMethod', 'points')}
              disabled={isLoading}
              className={cn(
                `flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium`,
                isLoading && 'opacity-50'
              )}
              style={{
                border: `1px solid ${getPrimaryAccentColor(accent_color)}`,
                color: getPrimaryAccentColor(accent_color),
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
              backgroundColor: getPrimaryAccentColor(accent_color),
              color: getAccentColor(accent_color),
            }}
          >
            Pay with Cash
          </button>
          <input type="hidden" {...register('paymentMethod')} />
        </form>
      )}
    </>
  );
}
