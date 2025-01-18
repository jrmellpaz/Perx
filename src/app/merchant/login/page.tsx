import MerchantLoginForm from '@/components/merchant/MerchantLogin';
import { MerchantLogo } from '@/components/merchant/MerchantLogo';

export default function MerchantLoginPage() {
  return (
    <main className="lg:flex flex-row h-dvh overflow-x-hidden font-sans">
      <section className="relative hidden lg:block grow">
        <img
          src="/merchant-reg-illustration.jpg"
          alt="Merchant Sign-up Illustration"
          className="object-cover absolute h-full w-full"
        />
      </section>
      <section className="h-full lg:w-1/3 flex flex-col items-center py-8 overflow-x-hidden">
        <div className="w-4/5 flex flex-col gap-4 h-full">
          <div className="h-12 w-fit flex items-center">
            <MerchantLogo
              logoClass="text-3xl pb-[5px] "
              sublogoClass="text-2xl"
            />
          </div>
          <MerchantLoginForm />
        </div>
      </section>
    </main>
  );
}
