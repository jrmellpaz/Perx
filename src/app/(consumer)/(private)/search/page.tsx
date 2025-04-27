import { hybridSearch, semanticSearch } from '@/actions/search';
import { fetchCoupon } from '@/actions/coupon';
import { fetchMerchant } from '@/actions/merchantProfile';
import { PerxCoupon } from '@/components/custom/PerxCoupon';
import { MerchantCard } from '@/components/custom/PerxMerchant';
import { Search } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const SearchParams = await searchParams;
  const query = SearchParams.q || '';

  let results: any[] = [];
  if (query) {
    const matches = await hybridSearch(query);
    results = await Promise.all(
      matches.map(async (match) => {
        if (match.type === 'coupon') {
          const coupon = await fetchCoupon(match.id);
          return { ...coupon, type: 'coupon', similarity: match.similarity };
        } else {
          const merchant = await fetchMerchant(match.id);
          return { ...merchant, type: 'merchant', similarity: match.similarity };
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
          className="border p-2 w-full pr-10" 
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2 rounded flex items-center">
          <Search /> 
          <span className="ml-2">Search</span> 
        </button>
      </form>

      <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
        {results.map((item) =>
          item.type === 'coupon' ? (
            <PerxCoupon key={item.id} coupon={item} variant="consumer" />
          ) : (
            <MerchantCard key={item.id} merchant={item} />
          )
        )}
      </div>
    </div>
  );
}
