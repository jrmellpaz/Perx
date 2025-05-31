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
  checkPurchaseLimit,
  checkConsumerPointsBalance,
} from '@/actions/purchase';
import { createClient } from '@/utils/supabase/client';
import { redirect, useRouter } from 'next/navigation';
import PerxCounter from './PerxCounter';

import type { Coupon } from '@/lib/types';

interface PerxTicketSubmitProps {
  coupon: Coupon;
  disabledByRank?: boolean;
  children?: React.ReactNode;
}

export function PerxTicketSubmit({
  coupon,
  disabledByRank = false,
  children,
}: PerxTicketSubmitProps) {
  const {
    points_amount,
    cash_amount,
    accent_color,
    discounted_price,
    original_price,
  } = coupon;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'hybrid'>('cash');
  const [quantity, setQuantity] = useState<number>(1);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const totalPrice =
    (discounted_price !== 0 ? discounted_price : original_price) * quantity;
  const totalPoints = points_amount * quantity;
  const adjustedPrice = cash_amount * quantity;

  const checkConsumerLogin = async (): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast('Redirecting you to login');
      redirect(
        `/login?next=${encodeURIComponent(`/view?coupon=${coupon.id}&merchant=${coupon.merchant_id}`)}`
      );
      return false;
    } else if (user?.user_metadata.role === 'merchant') {
      toast.error(
        'You must be logged in as a consumer to purchase this coupon.'
      );
      setIsLoading(false);
      redirect('/merchant');
      return false;
    } else {
      return true;
    }
  };

  const handlePaymentDialog = async (mode: 'cash' | 'hybrid') => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLoggedIn = await checkConsumerLogin();
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    try {
      // Check purchase limit before proceeding
      const purchaseLimitResult = await checkPurchaseLimit(
        user!.id,
        coupon.id,
        coupon
      );
      if (!purchaseLimitResult.success) {
        toast.error(purchaseLimitResult.message);
        setIsLoading(false);
        return;
      }

      setPaymentMode(mode);
      setIsDialogOpen(true);
      dialogRef.current?.showModal();
    } catch (error) {
      toast.error('Failed to validate purchase eligibility');
      console.error('Purchase limit check error:', error);
    }
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

    const isLoggedIn = await checkConsumerLogin();
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    try {
      // Check purchase limit before proceeding
      const purchaseLimitResult = await checkPurchaseLimit(
        user!.id,
        coupon.id,
        coupon
      );
      if (!purchaseLimitResult.success) {
        toast.error(purchaseLimitResult.message);
        return;
      }

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
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex w-full shrink-0 flex-row-reverse items-center justify-between gap-8 md:w-fit md:flex-row md:justify-start md:gap-6">
          <div className="flex flex-col items-start justify-center gap-2 text-xs">
            <span
              className="font-mono font-bold"
              style={{ color: getPrimaryAccentColor(accent_color) }}
            >
              Quantity
            </span>
            <PerxCounter
              max={coupon.max_purchase_limit_per_consumer}
              className="h-6 text-xs"
              accentColor={accent_color}
              onChange={(value) => setQuantity(value)}
            />
          </div>
          <div className="flex w-fit flex-col">
            <span
              className="font-mono text-xs font-bold"
              style={{ color: getPrimaryAccentColor(accent_color) }}
            >
              Total order
            </span>
            <h1 className="text-perx-black text-xl tracking-tight">
              &#8369;
              {totalPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
            {points_amount > 0 && cash_amount === 0 ? (
              <span className="text-perx-black flex items-center gap-1 text-sm tracking-tighter">
                or&nbsp;
                <img
                  src="/reward-points.svg"
                  alt="Reward Points"
                  width={18}
                  height={18}
                  className="pb-0.25"
                />{' '}
                {totalPoints.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                pts
              </span>
            ) : points_amount > 0 && cash_amount > 0 ? (
              <span className="text-perx-black flex items-center gap-1 text-sm tracking-tighter">
                or
                <img
                  src="/reward-points.svg"
                  alt="Reward Points"
                  width={18}
                  height={18}
                  className="pb-0.25"
                />
                {totalPoints.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                pts&nbsp;&nbsp;+&nbsp;&nbsp;&#8369;
                {adjustedPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col md:items-end">
          <div>{children}</div>
          <div className="flex w-full flex-col-reverse gap-2 whitespace-nowrap lg:w-fit lg:flex-row lg:gap-4">
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
                {points_amount > 0 && cash_amount === 0 && (
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
                    Buy with Points
                  </button>
                )}
                {points_amount > 0 && cash_amount > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      const isLoggedIn = await checkConsumerLogin();
                      console.log('isLoggedIn:', isLoggedIn);
                      if (!isLoggedIn) {
                        setIsLoading(false);
                        return;
                      }
                      const result =
                        await checkConsumerPointsBalance(totalPoints);

                      if (result.success) {
                        handlePaymentDialog('hybrid'); // opens PayPal for cash portion
                      } else {
                        toast.error(result.message);
                        setIsLoading(false);
                      }
                    }}
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
                    Buy with Points + Cash
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handlePaymentDialog('cash');
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
                  Buy with Cash
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <PaymentDialog
        dialogRef={dialogRef}
        isDialogOpen={isDialogOpen}
        handleClosePaymentDialog={handleClosePaymentDialog}
        coupon={coupon}
        paymentMode={paymentMode}
        totalPrice={totalPrice}
        totalPoints={totalPoints}
        adjustedPrice={adjustedPrice}
      />
    </>
  );
}

function PaymentDialog({
  dialogRef,
  isDialogOpen,
  handleClosePaymentDialog,
  coupon,
  paymentMode,
  totalPrice,
  totalPoints,
  adjustedPrice,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isDialogOpen: boolean;
  handleClosePaymentDialog: () => void;
  coupon: Coupon;
  paymentMode: 'cash' | 'hybrid';
  totalPrice: number;
  totalPoints: number;
  adjustedPrice: number;
}) {
  const router = useRouter();
  const amountToPay = paymentMode === 'hybrid' ? adjustedPrice : totalPrice;

  const handleCreatePaypalOrder: PayPalButtonsComponentProps['createOrder'] =
    async (_data, actions): Promise<string> => {
      try {
        // dialogRef.current?.close();

        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                value: amountToPay.toFixed(2),
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
          data.orderID,
          paymentMode, // Pass the payment mode to backend
          amountToPay
        );
        toast.success(`${message} Redirecting you to your coupons...`);
        dialogRef.current?.close();
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
