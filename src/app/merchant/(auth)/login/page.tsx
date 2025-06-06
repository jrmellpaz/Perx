import MerchantLoginForm from '@/components/merchant/MerchantLogin';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function MerchantLoginPage() {
  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <MerchantLogo logoClass="text-3xl pb-2" sublogoClass="text-2xl" />
      </div>
      <MerchantLoginForm />
    </div>
  );
}
