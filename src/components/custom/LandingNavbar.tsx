'use client';

import React from 'react';
import { LandingNavbarMenu } from '../../mockData/data';
import ResponsiveMenu from '@/components/custom/ResponsiveMenu';
import { AlignJustify } from 'lucide-react';
import Link from 'next/link';

export default function LandingNavBar() {
  function item(value: {
    id: number;
    title: string;
    link: string;
  }): React.ReactNode {
    return (
      <li key={value.id}>
        <a href={value.link}>{value.title}</a>
      </li>
    );
  }

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <nav>
        <div className="container flex items-center justify-between py-8">
          {/* Perx Section */}
          <div className="flex items-center gap-2 font-sans text-2xl font-bold text-white">
            <p>Perx</p>
          </div>
          {/* Menu Section */}
          <div className="ml-60 hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {LandingNavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      className="hover: inline-block px-3 py-1 font-mono text-white"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Log in w Google */}

          <div className="hidden items-center gap-4 md:flex">
            <div>Log in as</div>
            <Link
              href="/merchant/login"
              className="bg-perx-crimson text-perx-white hover:bg-perx-cloud hover:text-perx-crimson hover:border-perx-crimson border-perx-crimson rounded-md border-2 px-6 py-2 font-mono duration-200"
            >
              Merchant
            </Link>
            <Link
              href="/login"
              className="border-perx-crimson text-perx-crimson hover:bg-perx-cloud hover:text-perx-white rounded-md border-2 px-6 py-2 font-mono duration-200"
            >
              Consumer
            </Link>
          </div>
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <AlignJustify className="text-4xl" onClick={() => setOpen(!open)} />
          </div>
        </div>
      </nav>

      {/* Mobile sidebar section */}
      <ResponsiveMenu open={open} />
    </>
  );
}
