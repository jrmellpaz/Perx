import { fullTextSearch } from '@/actions/search';
import { filterCoupons } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { Coupon } from '@/components/custom/Coupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { PerxSearchbar } from '@/components/custom/PerxSearchbar';
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
    <section className="view-container flex h-full w-full flex-col items-center-safe gap-8 overflow-y-auto p-4">
      <PerxSearchbar query={query}>
        <form className="relative flex h-12 w-full items-center rounded-lg">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for coupons or merchants"
            className="h-full w-full rounded-full border px-4 py-2 text-sm transition-all outline-none focus:border-none focus:shadow-md"
          />
          <button
            type="submit"
            title="Search"
            className="hover:bg-perx-blue/10 md: text-muted-foreground/80 absolute right-0 flex aspect-square h-full w-auto cursor-pointer items-center justify-center gap-2 rounded-full transition-all"
          >
            <Search size={20} />
          </button>
        </form>
      </PerxSearchbar>

      <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
        {results.map((item) =>
          item.type === 'coupon' && item.coupon ? (
            <Coupon key={item.id} coupon={item.coupon} variant="consumer" />
          ) : item.type === 'merchant' && item.merchant ? (
            <MerchantCard key={item.id} merchant={item.merchant} />
          ) : null
        )}
      </div>
    </section>
  );
}
