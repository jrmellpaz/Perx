import { MerchantLogo } from "@/components/merchant/MerchantLogo";
import MerchantRegisterForm from "@/components/merchant/RegisterForm";

export default function MerchantRegisterPage() {
  return (
    <main className="lg:flex flex-row h-dvh overflow-hidden">
      <section className="relative hidden lg:block grow">
        <img
            src="/merchant-reg-illustration.jpg"
            alt="Merchant Sign-up Illustration"
            className="object-cover absolute h-full w-full"
        />
      </section>
      <section className="h-full flex flex-col items-center px-20 pt-8 overflow-hidden">
        <div className="w-96 flex flex-col gap-4">
          <div className="h-12 w-fit flex items-center">
            <MerchantLogo 
              logoClass="text-3xl pb-2"
              sublogoClass="text-xl"
            />
          </div>
          <MerchantRegisterForm />
        </div>
      </section>
    </main>
  )
}