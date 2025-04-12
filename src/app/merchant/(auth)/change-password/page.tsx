import MerchantChangePassword from '@/components/merchant/MerchantChangePassword';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';

export default async function MerchantChangePasswordPage() {
  return (
    <div className="flex h-full w-4/5 flex-col gap-4">
      <div className="flex h-12 w-fit items-center">
        <MerchantLogo logoClass="text-3xl pb-[5px]" sublogoClass="text-2xl" />
      </div>
      <MerchantChangePassword />
    </div>
  );
}
