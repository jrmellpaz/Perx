import { fullTextSearch } from '@/actions/search';
import { filterCoupons } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { Coupon } from '@/components/custom/Coupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { CouponFilterForm } from '@/components/custom/PerxFilter';
import { Search } from 'lucide-react';
import { CouponWithRank, Merchant } from '@/lib/types';

type ResultItem = {
  id: string;
  type: 'coupon' | 'merchant';
  coupon?: CouponWithRank;
  merchant?: Merchant;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const query = params.q;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const allowLimitedPurchase =
    params.allowLimitedPurchase === 'true' ? true : undefined;
  const allowRepeatPurchase =
    params.allowRepeatPurchase === 'true' ? true : undefined;
  const allowPointsPurchase =
    params.allowPointsPurchase === 'true' ? true : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  let results: ResultItem[] = [];

  if (query) {
    const matches = await fullTextSearch(query);

    const merchants: Merchant[] = [];

    for (const match of matches) {
      if (match.type === 'merchant') {
        const merchant = await fetchMerchant(match.id);
        if (merchant) merchants.push(merchant);
      }
    }

    const filteredCoupons = await filterCoupons({
      query, // Optional: You can add this support to filterCoupons() if you want to search by name/desc
      minPrice,
      maxPrice,
      allowLimitedPurchase,
      allowRepeatPurchase,
      allowPointsPurchase,
      endDate,
    });

    results = [
      ...filteredCoupons.map((c) => ({
        id: c.id,
        type: 'coupon' as const,
        coupon: c,
      })),
      ...merchants.map((m) => ({
        id: m.id,
        type: 'merchant' as const,
        merchant: m,
      })),
    ];
  }

  return (
    <div className="flex flex-col items-center-safe gap-4 p-4">
      <header className="sticky top-4 z-50 mt-4 flex w-full max-w-[800px] flex-col items-center justify-between gap-4 rounded-md bg-white p-4 shadow-md">
        <form className="relative flex h-12 w-full items-center rounded-lg shadow">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for coupons or merchants"
            className="h-full w-full rounded-lg border-none px-4 py-2 text-sm outline-none md:rounded-r-none"
          />
          <button
            type="submit"
            className="hover:bg-accent-foreground/10 md: md:bg-perx-blue md:text-perx-white md:hover:bg-perx-blue/80 absolute right-0 mr-1 flex h-full cursor-pointer items-center gap-2 rounded-full p-2 text-gray-400 transition-all md:static md:mr-0 md:rounded-lg md:rounded-l-none md:px-4 md:shadow"
          >
            <Search size={20} />
            <span className="hidden md:block">Search</span>
          </button>
        </form>

        {query && <CouponFilterForm />}
      </header>

      <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
        {results.map((item) =>
          item.type === 'coupon' && item.coupon ? (
            <Coupon key={item.id} coupon={item.coupon} variant="consumer" />
          ) : item.type === 'merchant' && item.merchant ? (
            <MerchantCard key={item.id} merchant={item.merchant} />
          ) : null
        )}
      </div>
    </div>
  );
}
