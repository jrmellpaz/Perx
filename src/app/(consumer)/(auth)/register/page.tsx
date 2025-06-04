import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerRegisterForm from '@/components/consumer/ConsumerRegisterForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an account',
};

export default async function ConsumerRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const next = (await searchParams).next;
  const redirectUrl = next ? decodeURIComponent(next) : '/explore';

  return (
    <section className="flex h-full w-9/10 flex-col gap-4 overflow-hidden py-8 sm:w-4/5">
      <div className="flex h-12 w-fit">
        <ConsumerLogo logoClass="text-3xl pb-2" />
      </div>
      <ConsumerRegisterForm redirectUrl={redirectUrl} />
    </section>
  );
}
