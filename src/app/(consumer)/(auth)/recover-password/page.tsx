import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerPasswordRecovery from '@/components/consumer/ConsumerRecovery';

export default async function ConsumerRecoverPasswordPage() {
  return (
    <div className="flex h-full w-4/5 flex-col gap-4">
      <div className="flex h-12 w-fit items-center">
        <ConsumerLogo logoClass="text-3xl pb-[5px]" />
      </div>
      <ConsumerPasswordRecovery />
    </div>
  );
}
