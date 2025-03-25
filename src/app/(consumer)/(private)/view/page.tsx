import { fetchCoupon } from '@/actions/merchant/coupon';
import { fetchRank } from '@/actions/rank';
import { PerxReadMore } from '@/components/custom/PerxReadMore';
import { cn } from '@/lib/utils';
import { SparklesIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const id = (await searchParams).id;

  if (!id) {
    redirect('/not-found');
  }

  return (
    <section className="h-full w-full overflow-hidden">
      <Ticket id={id} />
    </section>
  );
}

async function Ticket({ id }: { id: string }) {
  const coupon = await fetchCoupon(id);
  if (!coupon) {
    redirect('/not-found');
  }
  const {
    title,
    description,
    price,
    validFrom,
    validTo,
    isDeactivated,
    image,
    quantity,
    category,
    accentColor,
    consumerAvailability,
    allowPointsPurchase,
    pointsAmount,
  } = coupon;

  const { rank, maxPoints, icon } = await fetchRank(consumerAvailability);

  return (
    <section
      className={`flex h-full w-full items-center justify-center bg-${accentColor} overflow-y-auto`}
    >
      <div
        className={cn(
          `relative flex w-[90%] flex-col rounded-lg shadow-xl sm:w-[60%] sm:max-w-[480px]`,
          accentColor === 'perx-canopy'
            ? 'bg-[#b9f0df]'
            : accentColor === 'perx-rust'
              ? 'bg-[#fadac8]'
              : accentColor === 'perx-blue'
                ? 'bg-[#b7d0f7]'
                : accentColor === 'perx-gold'
                  ? 'bg-[#eddfc5]'
                  : accentColor === 'perx-azalea'
                    ? 'bg-[#f0c7db]'
                    : accentColor === 'perx-navy'
                      ? 'bg-[#b6c7e3]'
                      : 'bg-perx-white'
        )}
      >
        {/* Upper Half */}
        <div className="flex flex-col items-center">
          <div className="h-auto w-full overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={title}
              className="aspect-video h-auto w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-4 px-6 py-4">
            <div className="flex flex-col">
              <h2
                className={`text-${accentColor} font-mono text-lg/tight font-black tracking-tight`}
              >
                {title}
              </h2>
              {
                // TODO: Add merchant logo
              }
              <span className="border-perx-black text-perx-black w-fit rounded-full border px-1.5 py-0.5 text-xs/tight tracking-tight">
                {category}
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <h3
                  className={`text-${accentColor} font-mono text-sm font-medium tracking-tight`}
                >
                  {quantity}
                </h3>
                <p className={`text-perx-black text-xs tracking-tight`}>
                  Items left
                </p>
              </div>
              <div
                className={`border-muted-foreground mx-3 h-6 w-[0.25px] rounded-full border-l-[0.5px]`}
              ></div>
              <div className="flex flex-col items-center">
                <h3
                  className={`text-${accentColor} font-mono text-sm font-medium tracking-tight`}
                >
                  {new Date(validFrom).toLocaleDateString()} -{' '}
                  {new Date(validTo).toLocaleDateString()}
                </h3>
                <p className={`text-perx-black text-xs tracking-tight`}>
                  Validity
                </p>
              </div>
              <div
                className={`border-muted-foreground mx-3 h-6 w-[0.25px] rounded-full border-l-[0.5px]`}
              ></div>
              <div className="flex flex-col items-center">
                <h3
                  className={`text-${accentColor} font-mono text-sm font-medium tracking-tight`}
                >
                  {consumerAvailability}
                </h3>
                <p className={`text-perx-black text-xs tracking-tight`}>
                  For {rank} and up
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <h3
                className={`text-${accentColor} font-mono text-xs font-medium tracking-tight`}
              >
                About this coupon
              </h3>
              <PerxReadMore
                id="coupon-description"
                accentColor={accentColor}
                text={description}
              />
            </div>
          </div>
        </div>

        {/* Broken Line Divider */}
        <div className="relative flex items-center">
          <div
            className={`w-full border-t border-dashed border-${accentColor}`}
          ></div>
          {/* Left Circular Div */}
          <div
            className={`inset-right absolute -left-3 size-6 rounded-full bg-${accentColor}`}
          ></div>
          {/* Right Circular Div */}
          <div
            className={`inset-left absolute -right-3 size-6 rounded-full bg-${accentColor}`}
          ></div>
        </div>

        {/* Lower Half */}
        <div className="flex flex-col gap-4 p-6">
          {/* Price Section */}
          <div className="flex flex-col items-center gap-2">
            <span className={`text-${accentColor} font-mono text-xl font-bold`}>
              &#8369;{price.toFixed(2)}
            </span>
            {allowPointsPurchase && (
              <span className="flex items-center gap-2 text-sm text-gray-600">
                or <SparklesIcon size={20} className="" /> {pointsAmount} Points
              </span>
            )}
          </div>

          {/* Payment Buttons */}
          <div className="flex gap-4">
            {allowPointsPurchase && (
              <button
                className={`flex-1 rounded-lg border text-${accentColor} border-${accentColor} px-4 py-2 text-sm font-medium hover:bg-${accentColor}/50 cursor-pointer`}
              >
                Purchase with Points
              </button>
            )}
            <button
              className={`bg-${accentColor} hover:bg-${accentColor}/70 text-perx-white flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium`}
            >
              Pay with Cash
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
