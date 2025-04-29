'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[url('/bgLPF.png')] bg-cover bg-center">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-8">
        <img src="/perxIcon.png" className="h-85 w-85" alt="Perx Logo" />
        {/* Sign in merchant/consumer */}
        <div className="flex items-center gap-2 font-sans">
          <p className="text-perx-black text-5xl font-bold tracking-tighter">
            perx
          </p>
        </div>
        {/* <p className="font-mono">Log in as</p> */}
        <div className="flex space-x-4">
          <Link
            href="/merchant/login"
            className="bg-perx-crimson text-perx-white hover:bg-perx-crimson/30 hover:text-perx-crimson hover:border-perx-crimson border-perx-crimson rounded-md border-2 px-6 py-2 font-mono duration-200"
          >
            Merchant
          </Link>
          <Link
            href="/explore"
            className="border-perx-crimson text-perx-crimson hover:bg-perx-crimson/30 hover:text-perx-crimson rounded-md border-2 px-6 py-2 font-mono duration-200"
          >
            Consumer
          </Link>
        </div>
      </div>
    </div>
  );
}
