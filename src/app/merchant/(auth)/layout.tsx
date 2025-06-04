import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - Perx Merchant',
    default: 'Perx Merchant',
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-dvh flex-row overflow-x-hidden font-sans lg:flex">
      <section className="relative hidden grow lg:block">
        <img
          src="/merchant-reg-illustration.jpg"
          alt="Merchant Sign-up Illustration"
          className="absolute h-full w-full object-cover"
        />
      </section>
      <section className="flex h-full flex-col items-center overflow-x-hidden py-8 lg:w-1/3">
        {children}
      </section>
    </main>
  );
}
