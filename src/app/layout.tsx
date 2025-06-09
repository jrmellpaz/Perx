import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import Head from 'next/head';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { InstallPWAButton } from '@/components/pwa/Install';

import type { Metadata } from 'next';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s - Perx',
    default: 'Perx',
  },
  description: 'A coupon collection app',
  manifest: '/manifest.json',
  keywords: [
    'Perx',
    'Perx Merchant',
    'coupon',
    'merchant',
    'discount',
    'consumer',
    'loyalty',
    'deals',
    'offers',
    'rewards',
    'receipt',
    'points',
    'rebate',
    'commerce',
    'shopping',
    'savings',
    'retail',
  ],
  applicationName: 'Perx',
  publisher: '{ ctrl+f }',
  openGraph: {
    siteName: 'Perx',
    title: 'Perx',
    description: 'A coupon collection app',
    images: [
      {
        url: 'https://eeuryrrobjlaprfmkhah.supabase.co/storage/v1/object/public/perx/banner/banner.png',
        alt: 'Perx banner',
        width: 1920,
        height: 1080,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perx — discover deals, get rewarded.',
    description: 'A coupon collection app',
    images: {
      url: 'https://eeuryrrobjlaprfmkhah.supabase.co/storage/v1/object/public/perx/banner/banner.png',
      alt: 'Perx banner',
    },
  },
  category: 'shopping',
  creator: '{ ctrl+f }',
  authors: [
    {
      name: 'Jermel Lapaz',
    },
    {
      name: 'Kimberly Padilla',
    },
    {
      name: 'Anne Eloisa Abelido',
    },
    {
      name: 'Romella Lauron',
    },
  ],
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
