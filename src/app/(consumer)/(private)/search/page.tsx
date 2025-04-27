import { hybridSearch, semanticSearch } from '@/actions/search';
import { fetchCoupon } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { Search } from 'lucide-react';
import { Coupon, Coupons, Merchant, Merchants } from '@/lib/types';

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
