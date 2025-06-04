import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerPasswordRecovery from '@/components/consumer/ConsumerRecovery';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recover password',
};

export default async function ConsumerRecoverPasswordPage() {
  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerPasswordRecovery />
    </div>
  );
}
