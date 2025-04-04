'use client';

import { logoutConsumer } from '@/actions/consumer/auth';
import { ConsumerLogo } from '@/components/consumer/ConsumerLogo';
import { Button } from '@/components/ui/button';
import {
  CircleUserRound,
  // Inbox,
  LoaderCircle,
  Ticket,
  Compass,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { JSX, useState } from 'react';
import { motion } from 'motion/react';

interface NavItems {
  icon: JSX.Element;
  name: string;
  link: string;
}

const navItems: NavItems[] = [
  {
    icon: <Compass />,
    name: 'Explore',
    link: '/explore',
  },
  {
    icon: <Search />,
    name: 'Search',
    link: '/search',
  },
  {
    icon: <Ticket />,
    name: 'My Coupons',
    link: '/my-coupon',
  },
  // {
  //   icon: <Inbox />,
  //   name: 'Inbox',
  //   link: '/inbox',
  // },
  {
    icon: <CircleUserRound />,
    name: 'Profile',
    link: '/profile',
  },
];

export default function ConsumerTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main className="bg-perx-white flex h-dvh w-dvw flex-col-reverse overflow-hidden md:flex-row md:gap-2">
      <nav className="bg-perx-white h-18 w-dvw shrink-0 shadow-md md:h-dvh md:w-64 md:shadow-none">
        <div className="hidden h-full p-2 md:flex md:flex-col md:justify-between">
          <div>
            <div className="my-4 ml-2 h-10">
              <ConsumerLogo />
            </div>
            <VerticalNav />
          </div>
          <LogoutButton isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
        <div className="bg-perx-crimson/10 h-full w-full md:hidden">
          <HorizontalNav />
        </div>
      </nav>
      <main className="grow overflow-x-hidden overflow-y-auto bg-white shadow-xs md:rounded-l-xl">
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
        const isActive: boolean = pathname === item.link;

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
        const isActive: boolean = pathname === item.link;

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

function LogoutButton({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}) {
  const logout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await logoutConsumer();
    setIsLoading(false);
  };

  return (
    <form onSubmit={logout} className="mb-8 px-4">
      <Button
        type="submit"
        className="w-full transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoaderCircle
              className="-ms-1 animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Logging out
          </>
        ) : (
          'Log out'
        )}
      </Button>
    </form>
  );
}
