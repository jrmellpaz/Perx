import { MerchantCouponList } from '@/components/custom/MerchantCouponList';
import { redirect } from 'next/navigation';

export default async function CouponsTab({
  params,
}: {
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = await params;

  if (!merchantId) {
    redirect('/not-found');
  }

  return <MerchantCouponList userId={merchantId} variant={'consumer'} />;
}
