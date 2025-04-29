import { fullTextSearch } from '@/actions/search';
import { fetchCoupon, filterCoupons } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { CouponFilterForm } from '@/components/custom/PerxFilter';
import { Search } from 'lucide-react';
import { Coupon, Merchant } from '@/lib/types';

type ResultItem = {
  id: string;
  type: 'coupon' | 'merchant';
  coupon?: Coupon;
  merchant?: Merchant;
};

export default async function PerxSearch({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? '';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const allowLimitedPurchase = params.allowLimitedPurchase === 'true' ? true : undefined;
  const allowRepeatPurchase = params.allowRepeatPurchase === 'true' ? true : undefined;
  const allowPointsPurchase = params.allowPointsPurchase === 'true' ? true : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  let results: ResultItem[] = [];

  if (query) {
    const matches = await fullTextSearch(query);

    let coupons: Coupon[] = [];
    let merchants: Merchant[] = [];

    for (const match of matches) {
      if (match.type === 'coupon') {
        const coupon = await fetchCoupon(match.id);
        if (coupon) coupons.push(coupon);
      } else {
        const merchant = await fetchMerchant(match.id);
        if (merchant) merchants.push(merchant);
      }
    }

    const filteredCoupons = await filterCoupons(coupons, {
      minPrice,
      maxPrice,
      allowLimitedPurchase,
      allowRepeatPurchase,
      allowPointsPurchase,
      endDate,
    });

    results = [
      ...filteredCoupons.map((c) => ({ id: c.id, type: 'coupon' as const, coupon: c })),
      ...merchants.map((m) => ({ id: m.id, type: 'merchant' as const, merchant: m })),
    ];
  }

  return (
    <div className="p-4">
      <form className="mb-4 flex items-center">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search for coupons or merchants"
          className="w-full border p-2 pr-10"
        />
        <button
          type="submit"
          className="ml-2 flex items-center rounded bg-blue-500 px-4 py-2 text-white"
        >
          <Search />
          <span className="ml-2">Search</span>
        </button>
      </form>

      <CouponFilterForm />

      <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
        {results.map((item) =>
          item.type === 'coupon' && item.coupon ? (
            <PerxCoupon key={item.id} coupon={item.coupon} variant="consumer" />
          ) : item.type === 'merchant' && item.merchant ? (
            <MerchantCard key={item.id} merchant={item.merchant} />
          ) : null
        )}
      </div>
    </div>
  );
}
