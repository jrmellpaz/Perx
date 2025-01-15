import { MerchantRegisterForm } from "@/components/merchant/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function MerchantRegisterPage() {
    return (
        <main className="grid min-h-svh lg:grid-cols-2">
            <section className="relative hidden lg:block">
                <Image
                    src="/web-app-manifest-512x512.png"
                    alt="Merchant Sign-up Illustration"
                    width={500}
                    height={500}
                    className="object-cover absolute h-full w-full"
                />
            </section>
            <section className="flex flex-col items-center justify-center p-6 lg:p-12">
                <MerchantRegisterForm />
            </section>
        </main>
    )
}