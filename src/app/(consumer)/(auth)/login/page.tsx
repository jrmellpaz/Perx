import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerLoginForm from '@/components/consumer/ConsumerLogin';

export default async function ConsumerLoginPage() {
  return (
    <div className="flex h-full w-9/10 flex-col gap-4 sm:w-4/5">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerLoginForm />
    </div>
  );
}
