import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerRegisterForm from '@/components/consumer/ConsumerRegisterForm';

export default function ConsumerRegisterPage() {
  return (
    <section className="flex h-full w-9/10 flex-col gap-4 overflow-hidden py-8 sm:w-4/5">
      <div className="flex h-12 w-fit">
        <ConsumerLogo logoClass="text-3xl pb-2" />
      </div>
      <ConsumerRegisterForm />
    </section>
  );
}
