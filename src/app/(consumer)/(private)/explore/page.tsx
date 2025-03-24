import { getCoupons } from '@/actions/consumer/coupon';
import Ticket from "@/components/consumer/ConsumerTicket";
import PerxHeader from '@/components/custom/PerxHeader';

export default async function Explore() {
  const coupons = await getCoupons();

  return (
  //   <div className="flex flex-col items-center py-6">
      <div className="w-full p-6">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-6">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <Ticket
                key={coupon.id}
                title={coupon.title}
                description={coupon.description}
                price={coupon.price}
                image={coupon.image}
                merchantName={coupon.merchant?.name}
                merchantLogo={coupon.merchant?.logo}
              />
            ))
          ) : (
            <p>No tickets available.</p>
          )}
        </div>
      </div>
    // </div>
  );
}
