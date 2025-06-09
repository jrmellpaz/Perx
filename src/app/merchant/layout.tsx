import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - Perx Merchant',
    default: 'Perx Merchant',
  },
  description: 'A coupon collection app',
  manifest: '/manifest-merchant.json',
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
  applicationName: 'Perx Merchant',
  publisher: '{ ctrl+f }',
  openGraph: {
    siteName: 'Perx Merchant',
    title: 'Perx Merchant',
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
  return <>{children}</>;
}
