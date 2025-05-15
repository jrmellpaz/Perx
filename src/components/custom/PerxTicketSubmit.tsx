'use client';

import { cn } from '@/lib/utils';
import { RefObject, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getAccentColor, getPrimaryAccentColor } from '@/lib/utils';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js';
import { LoaderCircle } from 'lucide-react';
import PerxAlert from './PerxAlert';
import {
  approvePaypalOrder,
  purchaseWithRewardPoints,
} from '@/actions/purchase';

import type { Coupon } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';
import { redirect, useRouter } from 'next/navigation';

interface PerxTicketSubmitProps {
  coupon: Coupon;
  disabledByRank?: boolean;
}

export function PerxTicketSubmit({
  coupon,
  disabledByRank = false,
}: PerxTicketSubmitProps) {
  const { allow_points_purchase, accent_color } = coupon;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handlePaymentDialog = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast('Redirecting you to login');
      redirect(
        `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
      );
    }

    setIsDialogOpen(true);
    dialogRef.current?.showModal();
    setIsLoading(false);
  };

  const handleClosePaymentDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      dialogRef.current?.close();
    }, 300);
  };

  const handlePointsPurchase = async () => {
    setIsLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast('Redirecting you to login');
      redirect(
        `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
      );
    }

    try {
      const result = await purchaseWithRewardPoints(coupon);

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
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4">
        {isLoading ? (
          <div className="flex w-full items-center justify-center gap-2">
            <LoaderCircle
              className="animate-spin"
              size={18}
              strokeWidth={2}
              aria-hidden="true"
              style={{ color: getPrimaryAccentColor(accent_color) }}
            />
            <span className="text-perx-black text-sm">
              Processing your purchase
            </span>
          </div>
        ) : (
          <>
            {allow_points_purchase && (
              <button
                type="button"
                onClick={handlePointsPurchase}
                disabled={isLoading || disabledByRank}
                className={cn(
                  `flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed`,
                  isLoading && 'opacity-50'
                )}
                style={
                  !(isLoading || disabledByRank)
                    ? {
                        border: `1px solid ${getPrimaryAccentColor(accent_color)}`,
                        color: getPrimaryAccentColor(accent_color),
                      }
                    : {
                        border: `1px solid rgba(0, 0, 0, 0.15)`,
                        color: 'rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      }
                }
              >
                Purchase with Points
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                handlePaymentDialog();
              }}
              disabled={isLoading || disabledByRank}
              style={
                !(isLoading || disabledByRank)
                  ? {
                      backgroundColor: getPrimaryAccentColor(accent_color),
                      color: getAccentColor(accent_color),
                    }
                  : {
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      color: 'rgba(0, 0, 0, 0.2)',
                    }
              }
              className={cn(
                `disabled:bg-muted flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed`,
                isLoading && 'opacity-50'
              )}
            >
              Pay with Cash
            </button>
          </>
        )}
      </div>
      <PaymentDialog
        dialogRef={dialogRef}
        isDialogOpen={isDialogOpen}
        handleClosePaymentDialog={handleClosePaymentDialog}
        coupon={coupon}
      />
    </>
  );
}

function PaymentDialog({
  dialogRef,
  isDialogOpen,
  handleClosePaymentDialog,
  coupon,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isDialogOpen: boolean;
  handleClosePaymentDialog: () => void;
  coupon: Coupon;
}) {
  const router = useRouter();

  const handleCreatePaypalOrder: PayPalButtonsComponentProps['createOrder'] =
    async (_data, actions): Promise<string> => {
      try {
        dialogRef.current?.close();

        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                value: coupon.price.toFixed(2),
                currency_code: 'PHP',
              },
              description: coupon.title,
            },
          ],
        });
      } catch (error) {
        console.error('Error creating PayPal order:', error);
        toast.error('Failed to create PayPal order. Please try again.');
        return '';
      }
    };

  const handleApprovePaypalOrder: PayPalButtonsComponentProps['onApprove'] =
    async (data): Promise<void> => {
      try {
        const { message, data: consumerCoupon } = await approvePaypalOrder(
          coupon,
          data.orderID
        );
        toast.success(`${message} Redirecting you to your coupons...`);
        router.push(`/my-coupons/view?coupon=${consumerCoupon?.id}`);
      } catch (error) {
        console.error('Error approving PayPal order:', error);
        toast.error('Failed to approve PayPal order. Please try again.');
      }
    };

  const onError: PayPalButtonsComponentProps['onError'] = (error) => {
    console.error('PayPal error:', error);
    toast.error(`An error occurred with PayPal. ${error.message}`);
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'bg-perx-white fixed inset-0 m-auto w-9/10 rounded-lg shadow-lg transition-all duration-300 sm:max-w-[600px]',
        isDialogOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      )}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          handleClosePaymentDialog();
        }
      }}
    >
      <div className="flex h-full w-full flex-col gap-4 p-8 font-bold">
        <h1 className="text-perx-black font-mono text-lg tracking-tight">
          Select your payment method
        </h1>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            currency: 'PHP',
            intent: 'capture',
          }}
        >
          <LoadingPaypal />
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              borderRadius: 6,
              height: 44,
              disableMaxWidth: true,
              label: 'pay',
            }}
            createOrder={handleCreatePaypalOrder}
            onApprove={handleApprovePaypalOrder}
            onError={onError}
          />
        </PayPalScriptProvider>
      </div>
    </dialog>
  );
}

function LoadingPaypal() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center p-2">
        <LoaderCircle
          className="text-perx-blue -ms-1 me-2 animate-spin"
          size={40}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
    );
  } else if (isRejected) {
    return (
      <div className="flex w-full items-center justify-center">
        <PerxAlert
          heading="Fetch error"
          message="Unable to load PayPal SDK. Refresh the page to try again."
          variant="error"
        />
      </div>
    );
  }
}
