import { PerxLogoHeader } from '@/components/custom/PerxHeader';
import { createClient } from '@/utils/supabase/server';
import { ExploreList } from '@/components/consumer/ExploreList';
import { fullTextSearch } from '@/actions/search';
import { filterCoupons } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { Coupon } from '@/components/custom/Coupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { PerxSearchbar } from '@/components/custom/PerxSearchbar';
import { Search } from 'lucide-react';

import type { CouponWithRank, Merchant } from '@/lib/types';

type ResultItem = {
  id: string;
  type: 'coupon' | 'merchant';
  coupon?: CouponWithRank;
  merchant?: Merchant;
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const merchants: Merchant[] = [];

  if (query) {
    const matches = await fullTextSearch(query);
    for (const match of matches) {
      if (match.type === 'merchant') {
        const merchant = await fetchMerchant(match.id);
        if (merchant) merchants.push(merchant);
      }
    }
  }

  const filteredCoupons = await filterCoupons({
    query,
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

  return (
    <>
      <PerxLogoHeader />
      <section className="flex w-full flex-col items-center-safe gap-8 p-4">
        <PerxSearchbar query={query}>
          <form className="relative flex h-12 w-full items-center rounded-lg">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search for coupons or merchants"
              autoFocus
              className="h-full w-full rounded-full border py-3 pr-16 pl-4 text-sm transition-all outline-none focus:border-none focus:shadow-md"
            />
            <button
              type="submit"
              title="Search"
              className="hover:bg-perx-blue/90 bg-perx-blue absolute right-0 flex aspect-square h-full w-14 cursor-pointer items-center justify-center rounded-r-full pr-1 text-white transition-all"
            >
              <Search size={20} />
            </button>
          </form>
        </PerxSearchbar>
        {Object.keys(params).length === 0 ? (
          <ExploreList userId={user?.id} />
        ) : results.length > 0 ? (
          <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
            {results.map((item) =>
              item.type === 'coupon' && item.coupon ? (
                <Coupon key={item.id} coupon={item.coupon} variant="consumer" />
              ) : item.type === 'merchant' && item.merchant ? (
                <MerchantCard key={item.id} merchant={item.merchant} />
              ) : null
            )}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center p-8 text-gray-500">
            No coupons or merchants found
          </div>
        )}
      </section>
    </>
  );
}
