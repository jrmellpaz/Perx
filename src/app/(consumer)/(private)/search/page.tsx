import { Coupon, Merchant } from '@/lib/types';

import PerxSearch from '@/components/custom/PerxSearch';

type SearchResults = Array<{
  id: string;
  type: 'coupon' | 'merchant';
  coupon?: Coupon;
  merchant?: Merchant;
}>;

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  return <PerxSearch searchParams={searchParams} />;
}
