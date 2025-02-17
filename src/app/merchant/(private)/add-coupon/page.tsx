import AddCouponForm from '@/components/merchant/AddCouponForm';

export default function AddCoupon() {
  return (
    <section className="h-full w-full">
      <h1 className="text-xl font-medium tracking-tighter">Add Coupon</h1>
      <section className="flex w-full justify-center">
        <AddCouponForm />
      </section>
    </section>
  );
}
