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
    icon: <Compass strokeWidth={1.5} size={20} />,
    name: 'Explore',
    path: '/explore',
    link: '/explore',
  },
  {
    icon: <Search strokeWidth={1.5} size={20} />,
    name: 'Search',
    path: '/search',
    link: '/search',
  },
  {
    icon: <Ticket strokeWidth={1.5} size={20} />,
    name: 'My Coupons',
    path: '/my-coupons',
    link: '/my-coupons',
  },
  {
    icon: <CircleUserRound strokeWidth={1.5} size={20} />,
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
    <main className="bg-perx-white flex h-dvh w-dvw flex-col-reverse overflow-hidden md:flex-row">
      <nav className="bg-perx-gray h-14 w-dvw shrink-0 shadow-md md:h-dvh md:w-20 md:shadow-none lg:w-56">
        <div className="hidden h-full border-r-2 md:flex md:flex-col md:justify-between">
          <div className="my-2 h-16 w-full border-b-2 p-2 py-4 pl-6">
            <ConsumerLogo logoClass="text-xl pb-2 hidden lg:block" />
          </div>
          <VerticalNav />
        </div>
        <div className="bg-perx-crimson/10 h-full w-full md:hidden">
          <HorizontalNav />
        </div>
      </nav>
      <main className="scrollable-container w-full grow overflow-x-hidden overflow-y-auto bg-white">
        {children}
      </main>
    </main>
  );
}

function VerticalNav() {
  const pathname = usePathname();

  return (
    <ul className="flex h-full w-full flex-col p-2">
      {navItems.map((item, index) => {
        const isActive = pathname.startsWith(item.path);
        const iconWithDynamicStroke = React.cloneElement(item.icon, {
          strokeWidth: isActive ? 2 : 1.5,
        });

        return (
          <Link
            href={item.link}
            key={index}
            title={item.name}
            className={`hover:bg-perx-cloud/10 h-fit border-2 px-4 py-3 transition-all md:rounded-xl lg:rounded-full ${isActive ? 'border-gray-200 bg-white hover:bg-white/60' : 'border-perx-gray'}`}
          >
            <li
              className={`flex w-full items-center justify-center gap-3.5 text-sm font-medium lg:justify-start`}
            >
              {iconWithDynamicStroke}
              <span className={`hidden lg:block ${isActive && 'font-bold'}`}>
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
        const isActive = pathname.startsWith(item.path);
        const iconWithDynamicStroke = React.cloneElement(item.icon, {
          strokeWidth: isActive ? 2 : 1.5,
        });

        return (
          <Link
            href={item.link}
            key={index}
            className="hover:bg-perx-cloud/20 h-full grow basis-1"
          >
            <li
              className={`flex h-full flex-col items-center justify-center gap-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}
            >
              <motion.div
                {...(isActive && {
                  initial: { scaleX: '30%', scaleY: '75%' },
                  animate: { scaleX: '100%', scaleY: '100%' },
                  transition: { duration: 0.15, ease: 'easeInOut' },
                  exit: { scaleX: 0, scaleY: '50%', opacity: 0 },
                })}
                className={`${isActive && 'bg-perx-crimson/20'} flex w-4/5 items-center justify-center rounded-full py-1 sm:w-3/5`}
              >
                {iconWithDynamicStroke}
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
