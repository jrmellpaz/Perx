import { fetchCouponCategories } from '@/actions/coupon';
import { fetchRanks } from '@/actions/rank';
import { PerxLogoHeader } from '@/components/custom/PerxHeader';
import AddCouponForm from '@/components/merchant/AddCouponForm';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';

export default async function AddCoupon() {
  const ranks = await fetchRanks();
  const categories = await fetchCouponCategories();

  return (
    <>
      <PerxLogoHeader>
        <MerchantLogo
          logoClass="text-xl pb-1.5"
          sublogoClass="text-md pb-0.5"
        />
      </PerxLogoHeader>
      <section className="flex w-full flex-col items-center -space-y-2 p-4 md:px-6">
        <h1 className="w-full max-w-[800px] font-mono text-2xl font-medium tracking-tighter">
          Create coupon
        </h1>
        <section className="flex w-full justify-center">
          <AddCouponForm ranks={ranks} categories={categories} />
        </section>
      </section>
    </>
  );
}
