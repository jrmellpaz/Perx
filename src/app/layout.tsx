import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import Head from 'next/head';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { InstallPWAButton } from '@/components/pwa/Install';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Perx',
  description: 'A coupon collection app',
  manifest: '/web.manifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="apple-mobile-web-app-title" content="Perx" />
      </Head>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <NextTopLoader color="#A50000" showSpinner={false} height={3} />
        {children}
        <Toaster />
        <ServiceWorkerRegister />
        <InstallPWAButton />
      </body>
    </html>
  );
}
