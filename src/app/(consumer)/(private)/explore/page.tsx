import { getCoupons } from '@/actions/consumer/coupon';
import Ticket from "@/components/consumer/ConsumerTicket";
import PerxHeader from '@/components/custom/PerxHeader';

export default async function Explore() {
  const coupons = await getCoupons();

  return (
    <div className="flex flex-col items-center p-4">
      <PerxHeader title="Explore" link="/explore" />
      <div className="flex flex-col gap-4 w-full items-center">
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
  );
}