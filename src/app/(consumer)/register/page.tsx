import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import ConsumerRegisterForm from '@/components/consumer/register/ConsumerRegisterForm';

export default function ConsumerRegisterPage() {
  return (
    <main className="lg:flex flex-row h-dvh overflow-hidden font-sans">
      <section className="relative hidden lg:block grow">
        <img
          src="/merchant-reg-illustration.jpg"
          alt="Merchant Sign-up Illustration"
          className="object-cover absolute h-full w-full"
        />
      </section>
      <section className="h-full lg:w-1/3 flex flex-col items-center py-8 overflow-hidden">
        <div className="w-4/5 flex flex-col gap-4 h-full">
          <div className="h-12 w-fit flex items-center">
            <ConsumerLogo logoClass="text-3xl pb-2" />
          </div>
          <ConsumerRegisterForm />
        </div>
      </section>
    </main>
  );
}
