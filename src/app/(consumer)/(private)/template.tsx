'use client';

import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import { CircleUserRound, Ticket, Compass, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { JSX, useState } from 'react';
import { motion } from 'motion/react';

interface NavItems {
  icon: JSX.Element;
  name: string;
  path: string;
  link: string;
}

const navItems: NavItems[] = [
  {
    icon: <Compass strokeWidth={1.5} />,
    name: 'Explore',
    path: '/explore',
    link: '/explore',
  },
  {
    icon: <Search strokeWidth={1.5} />,
    name: 'Search',
    path: '/search',
    link: '/search',
  },
  {
    icon: <Ticket strokeWidth={1.5} />,
    name: 'My Coupons',
    path: '/my-coupons',
    link: '/my-coupons',
  },
  {
    icon: <CircleUserRound strokeWidth={1.5} />,
    name: 'Profile',
    path: '/profile',
    link: '/profile/missions',
  },
];

export default function ConsumerTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-perx-white flex h-dvh w-dvw flex-col-reverse overflow-hidden md:flex-row md:gap-2">
      <nav className="bg-perx-white h-18 w-dvw shrink-0 shadow-md md:h-dvh md:w-64 md:shadow-none">
        <div className="hidden h-full p-2 md:flex md:flex-col md:justify-between">
          <div>
            <div className="my-4 ml-2 h-8">
              <ConsumerLogo logoClass="text-2xl pb-2" />
            </div>
            <VerticalNav />
          </div>
        </div>
        <div className="bg-perx-crimson/10 h-full w-full md:hidden">
          <HorizontalNav />
        </div>
      </nav>
      <main className="scrollable-container w-full grow overflow-x-hidden overflow-y-auto bg-white shadow-xs md:rounded-l-xl">
        {children}
      </main>
    </main>
  );
}

function VerticalNav() {
  const pathname = usePathname();

  return (
    <ul className="flex h-full w-full flex-col">
      {navItems.map((item, index) => {
        const isActive: boolean = pathname.startsWith(item.path);

        return (
          <Link
            href={item.link}
            key={index}
            className={`hover:bg-perx-cloud/10 h-fit rounded-md px-4 py-3 ${isActive && 'bg-perx-crimson/10 hover:bg-perx-crimson/15'}`}
          >
            <li
              className={`flex w-full items-center gap-4 ${isActive && 'text-perx-crimson'}`}
            >
              {item.icon}
              <span className={`${isActive && 'font-medium'}`}>
                {item.name}
              </span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}

function HorizontalNav() {
  const pathname = usePathname();

  return (
    <ul className="flex h-full w-full items-center justify-around">
      {navItems.map((item, index) => {
        const isActive: boolean = pathname.startsWith(item.path);

        return (
          <Link
            href={item.link}
            key={index}
            className="hover:bg-perx-cloud/20 h-full grow basis-1"
          >
            <li
              className={`flex h-full flex-col items-center justify-center gap-0.5 ${isActive && 'text-perx-crimson'}`}
            >
              <motion.div
                {...(isActive && {
                  initial: { scaleX: '30%', scaleY: '75%' },
                  animate: { scaleX: '100%', scaleY: '100%' },
                  transition: { duration: 0.15, ease: 'easeInOut' },
                  exit: { scaleX: 0, scaleY: '50%', opacity: 0 },
                })}
                className={`${isActive && 'bg-perx-crimson/30'} flex w-4/5 items-center justify-center rounded-full py-1 sm:w-3/5`}
              >
                {item.icon}
              </motion.div>
              <span className={`text-[10px] ${isActive && 'font-semibold'}`}>
                {item.name}
              </span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
