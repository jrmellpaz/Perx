import { JSX } from 'react';
import { fetchConsumerProfile } from '@/actions/consumerProfile';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AwardIcon,
  ClipboardListIcon,
  PencilIcon,
  SettingsIcon,
  ReceiptText,
  History,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Tabs from '@/components/custom/PerxTabs';
import { fetchRank } from '@/actions/rank';

import type { Rank } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ConsumerProfileLayout({
  tabs,
}: {
  tabs: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    name,
    points_balance,
    points_total,
    rank: rankId,
  } = await fetchConsumerProfile(user!.id);

  const rank = await fetchRank(rankId);
  let nextIcon: string | null = null;

  if (rankId.toString() !== '15') {
    console.log('hereeeeee', rankId);
    const nextRank = await fetchRank(rankId + 1);
    nextIcon = nextRank.icon;
  }

  type ProfileNavItems = {
    icon: JSX.Element;
    name: string;
    path: string;
  };

  const profileNavItems: ProfileNavItems[] = [
    {
      name: 'Missions',
      icon: <ClipboardListIcon size={20} aria-hidden="true" />,
      path: '/profile/missions',
    },
    {
      name: 'Achievements',
      icon: <AwardIcon size={20} aria-hidden="true" />,
      path: '/profile/achievements',
    },
  ];

  return (
    <section
      className="flex h-full flex-col overflow-x-hidden"
      style={{ backgroundColor: `${rank.secondary_color}50` }}
    >
      <Header name={name} primaryColor={rank.primary_color} />
      <main className="relative -top-20 mx-auto flex grow flex-col items-center gap-8">
        <LoyaltyRewardsCard
          nextIcon={nextIcon}
          rank={rank}
          balancePoints={points_balance}
          totalPoints={points_total}
          primaryColor={rank.primary_color}
        />
        <Menu rank={rank} />
        <div className="mx-auto flex flex-col items-center-safe">
          <div className="sticky top-0 z-50 w-full">
            <Tabs tabItems={profileNavItems} />
          </div>
          <div className="w-[95%] max-w-[800px]">{tabs}</div>
        </div>
      </main>
    </section>
  );
}

function Header({
  name,
  primaryColor,
}: {
  name: string;
  primaryColor: string;
}) {
  return (
    <header
      style={{ backgroundColor: primaryColor }}
      className="z-20 flex h-[240px] shrink-0 items-start justify-between px-6 pt-4 md:px-12"
    >
      <div className="flex grow flex-col">
        <p className="text-perx-white text-sm/tight">Hello,</p>
        <h1 className="text-perx-white font-mono text-2xl font-medium">
          {name}
        </h1>
      </div>
      <div className="flex">
        <ButtonGroup />
      </div>
    </header>
  );
}

function Menu({ rank }: { rank: Rank }) {
  return (
    <div className="flex h-auto w-[90%] max-w-[800px] flex-col gap-2 md:flex-row">
      <Link
        href="/receipt"
        className="text-perx-white flex basis-1/2 items-center rounded-xl hover:shadow-md"
        style={{
          backgroundColor: rank.primary_color,
        }}
      >
        <div className="flex items-center gap-4 p-5">
          <ReceiptText size={32} />
          <div className="flex flex-col justify-start">
            <span className="font font-mono font-bold">Scan & earn</span>
            <p className="text-xs">
              Scan receipts from partner merchants & earn points
            </p>
          </div>
        </div>
      </Link>
      <Link
        href="/points-history"
        className="text-perx-white flex basis-1/2 items-center rounded-xl hover:shadow-md"
        style={{
          backgroundColor: rank.primary_color,
        }}
      >
        <div className="flex items-center gap-4 p-5">
          <History size={32} />
          <div className="flex flex-col justify-start">
            <span className="font font-mono font-bold">Points history</span>
            <p className="text-xs">Check your points history</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ButtonGroup() {
  return (
    <>
      <Link href="/edit-profile">
        <Button
          variant={'ghost'}
          className="text-perx-white hover:bg-perx-black/10 hover:text-perx-white aspect-square h-auto rounded-full"
          title="Edit profile"
        >
          <PencilIcon />
        </Button>
      </Link>
      <Link href="/settings">
        <Button
          variant={'ghost'}
          className="text-perx-white hover:bg-perx-black/10 hover:text-perx-white aspect-square h-auto rounded-full"
          title="Settings"
        >
          <SettingsIcon />
        </Button>
      </Link>
    </>
  );
}

function LoyaltyRewardsCard({
  nextIcon,
  rank,
  balancePoints,
  totalPoints,
  primaryColor,
}: {
  nextIcon: string | null;
  rank: Rank;
  balancePoints: number;
  totalPoints: number;
  primaryColor: string;
}) {
  return (
    <div className="bg-perx-white text-perx-black z-50 flex aspect-[7/3] h-auto w-[90%] max-w-[800px] flex-col items-center justify-around rounded-xl px-4 py-4 shadow-md sm:px-8 md:w-4/5 md:px-12">
      <div className="relative -top-18 flex flex-col items-center gap-1">
        <img src={rank.icon} alt="Rank icon" className="size-32" />
        <h2
          style={{ color: rank.primary_color }}
          className="font-mono text-lg font-medium"
        >
          {rank.rank}
        </h2>
      </div>
      <div className="relative -top-10 flex w-full items-center gap-3">
        <img
          src="/reward-points.svg"
          alt="Reward points icon"
          className="aspect-sqaure size-12"
        />
        <h1 className="font-mono text-3xl font-medium md:text-4xl">
          {balancePoints.toLocaleString('en-US', {
            style: 'decimal',
          })}
        </h1>
      </div>
      <div className="relative -top-4 flex w-full flex-col justify-start gap-2">
        <h3 className="text-muted-foreground m-0 p-0 text-base tracking-tighter">
          Earn more points to unlock the next tier
        </h3>
        <div className="flex grow flex-col items-center gap-1">
          <div className="w-full">
            <Progress
              value={totalPoints}
              max={rank.max_points}
              className="h-3"
              indicatorStyle={{ backgroundColor: primaryColor }}
            />
          </div>
          <div className="flex w-full justify-between">
            <h3 className="font-mono font-medium">
              {totalPoints.toLocaleString()}
            </h3>

            <div className="flex shrink-0 items-center gap-1">
              <h3 className="font-mono font-medium">
                {rank.max_points.toLocaleString()}
              </h3>
              {nextIcon && (
                <img src={nextIcon} alt="Next tier icon" className="size-6" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
