import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Head from 'next/head';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Perx',
  description: 'A coupon collection app',
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129833820581954"
          crossOrigin="anonymous"
        />
      </Head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <NextTopLoader color="#A50000" showSpinner={false} height={3} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
