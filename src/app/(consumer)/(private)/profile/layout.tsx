import { JSX } from 'react';
import { getConsumerProfile } from '@/actions/consumer/profile';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AwardIcon,
  ClipboardListIcon,
  PencilIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Tabs from '@/components/custom/Tabs';
import { fetchRank } from '@/actions/rank';
import { Rank } from '@/lib/consumer/rankSchema';

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
    balancePoints,
    totalPoints,
    rank: rankId,
  } = await getConsumerProfile(user!.id);

  const rank = await fetchRank(rankId);
  let nextIcon: string | null = null;

  if (rankId.toString() !== '15') {
    console.log('hereeeeee', rankId);
    const nextRank = await fetchRank((parseInt(rankId) + 1).toString());
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
    <section className="flex h-full flex-col overflow-x-hidden">
      <Header name={name} primaryColor={rank.primaryColor} />
      <main
        style={{ backgroundColor: `${rank.secondaryColor}33` }}
        className="flex grow flex-col items-center"
      >
        <LoyaltyRewardsCard
          nextIcon={nextIcon}
          rank={rank}
          balancePoints={balancePoints}
          totalPoints={totalPoints}
        />
        <div className="relative -top-20">
          <Tabs tabItems={profileNavItems} />
        </div>
        <div className="relative -top-20 w-[90%] max-w-[800px]">{tabs}</div>
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
      className="z-0 flex h-[240px] shrink-0 items-start justify-between px-6 pt-4 md:px-12"
    >
      <div className="flex grow flex-col">
        <p className="text-perx-white text-sm/tight">Hello</p>
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

function ButtonGroup() {
  return (
    <>
      <Link href="/edit-profile">
        <Button
          variant={'ghost'}
          className="text-perx-white hover:bg-perx-black/10 hover:text-perx-white aspect-square h-auto rounded-full"
        >
          <PencilIcon />
        </Button>
      </Link>
      <Link href="/settings">
        <Button
          variant={'ghost'}
          className="text-perx-white hover:bg-perx-black/10 hover:text-perx-white aspect-square h-auto rounded-full"
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
}: {
  nextIcon: string | null;
  rank: Rank;
  balancePoints: number;
  totalPoints: number;
}) {
  return (
    <div className="bg-perx-white text-perx-black relative -top-28 flex aspect-[7/3] h-auto w-[90%] max-w-[800px] flex-col items-center justify-around rounded-xl px-4 py-4 shadow-md sm:px-8 md:w-4/5 md:px-12">
      <div className="relative -top-18 flex flex-col items-center gap-1">
        <img src={rank.icon} alt="Rank icon" className="size-32" />
        <h2
          style={{ color: rank.primaryColor }}
          className="font-mono text-lg font-medium"
        >
          {rank.rank}
        </h2>
      </div>
      <div className="relative -top-10 flex w-full items-center gap-3">
        <SparklesIcon style={{ color: '#FF7F50' }} size={36} />{' '}
        <h1 className="font-mono text-5xl font-medium">
          {balancePoints}
          <span className="text-muted-foreground font-sans text-base font-normal tracking-tighter">
            &nbsp;&nbsp;points balance
          </span>
        </h1>
      </div>
      <div className="relative -top-4 flex w-full flex-col justify-start gap-2">
        <h3 className="text-muted-foreground m-0 p-0 text-base tracking-tighter">
          Earn more points to unlock the next tier
        </h3>
        <div className="flex grow items-center gap-3">
          <h3 className="font-mono font-medium">{totalPoints}</h3>
          <div className="w-full">
            <Progress
              value={totalPoints}
              indicatorClass="bg-perx-rust"
              max={rank.maxPoints}
              className="h-3"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <h3 className="font-mono font-medium">{rank.maxPoints}</h3>
            {nextIcon && (
              <img src={nextIcon} alt="Next tier icon" className="size-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
