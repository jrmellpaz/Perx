'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-40 flex flex-col items-center space-y-8">
        <img src="/perxIcon.png" className="mb-8 h-85 w-85" alt="Perx Logo" />
        {/* Sign in merchant/consumer */}
        <div className="flex space-x-4">
          <Link
            href="/merchant/register"
            className="bg-perx-crimson text-perx-white hover:bg-perx-cloud hover:text-perx-crimson hover:border-perx-crimson border-perx-crimson rounded-md border-2 px-6 py-2 font-mono duration-200"
          >
            Sign up as Merchant
          </Link>
          <Link
            href="/register"
            className="border-perx-crimson text-perx-crimson hover:bg-perx-cloud hover:text-perx-white rounded-md border-2 px-6 py-2 font-mono duration-200"
          >
            Sign up as Consumer
          </Link>
        </div>
      </div>
    </div>
  );
}
