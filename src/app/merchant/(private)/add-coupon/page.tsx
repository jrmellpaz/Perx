import { fetchCouponCategories } from '@/actions/coupon';
import { fetchRanks } from '@/actions/rank';
import AddCouponForm from '@/components/merchant/AddCouponForm';

export default async function AddCoupon() {
  const ranks = await fetchRanks();
  const categories = await fetchCouponCategories();

  return (
    <section className="h-full w-full p-4 md:px-6">
      <h1 className="text-xl font-medium tracking-tighter">Add Coupon</h1>
      <section className="flex w-full justify-center">
        <AddCouponForm ranks={ranks} categories={categories} />
      </section>
    </section>
  );
}
