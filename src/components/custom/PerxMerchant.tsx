// components/MerchantCard.tsx
import Link from 'next/link';

export function MerchantCard({ merchant }: { merchant: any }) {
  return (
    <Link href={`/merchant-profile/${merchant.id}/coupons`}>
      <div className="border rounded-md p-4 flex flex-col gap-2 bg-white hover:shadow-md">
        <h2 className="text-lg font-semibold">{merchant.name}</h2>
        <p className="text-sm text-gray-600">{merchant.bio}</p>
        <p className="text-xs text-gray-400">{merchant.address}</p>
      </div>
    </Link>
  );
}
