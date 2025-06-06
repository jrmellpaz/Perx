import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerLoginForm from '@/components/consumer/ConsumerLogin';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function ConsumerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const next = (await searchParams).next;
  const redirectUrl = next ? decodeURIComponent(next) : '/explore';

  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerLoginForm redirectUrl={redirectUrl} />
    </div>
  );
}
