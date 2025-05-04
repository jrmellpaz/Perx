import PerxSearch from '@/components/custom/PerxSearch';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  return <PerxSearch searchParams={searchParams} />;
}
