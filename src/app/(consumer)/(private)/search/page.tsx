import { hybridSearch, semanticSearch } from '@/actions/search';
import { fetchCoupon } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { Search } from 'lucide-react';
import { Coupon, Merchant } from '@/lib/types';

type SearchResults = Array<{
  id: string;
  type: 'coupon' | 'merchant';
  similarity: number;
  coupon?: Coupon;
  merchant?: Merchant;
}>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = (await searchParams).q;

  let results: SearchResults = [];
  if (query) {
    const matches = await hybridSearch(query);
    results = await Promise.all(
      matches.map(async (match) => {
        if (match.type === 'coupon') {
          const coupon = await fetchCoupon(match.id);
          return {
            id: match.id,
            coupon,
            type: 'coupon',
            similarity: match.similarity,
          };
        } else {
          const merchant = await fetchMerchant(match.id);
          return {
            id: match.id,
            merchant,
            type: 'merchant',
            similarity: match.similarity,
          };
        }
      })
    );
    results.sort((a, b) => b.similarity - a.similarity);
  }

  return (
    <div className="flex flex-col items-center-safe p-4">
      <form className="relative mb-4 flex h-10 w-full max-w-[800px] items-center rounded-full shadow-md transition-all">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search for coupons or merchants"
          className="h-full w-full rounded-l-full border px-4 text-sm shadow-none outline-none"
        />
        <button
          type="submit"
          className="relative right-0 flex h-full items-center rounded-r-full bg-blue-500 py-2 pr-6 pl-4 text-white"
        >
          <Search size={22} />
        </button>
      </form>

      {results && (
        <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
          {results.map((item) =>
            item.type === 'coupon' && item.coupon ? (
              <PerxCoupon
                key={item.id}
                coupon={item.coupon}
                variant="consumer"
              />
            ) : item.type === 'merchant' && item.merchant ? (
              <MerchantCard key={item.id} merchant={item.merchant} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
