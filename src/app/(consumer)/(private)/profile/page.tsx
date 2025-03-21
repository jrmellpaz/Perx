import React from 'react';
import { getConsumerProfile } from '@/actions/consumer/profile';
import { createClient } from '@/utils/supabase/server';
import type { ConsumerProfile } from '@/lib/consumer/profileSchema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DiamondIcon,
  PencilIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default async function ConsumerProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { name, interests, referral_code } = await getConsumerProfile(user!.id);

  // Temporary consumer data
  const tier = 'Bronze';
  const rank = 'II';
  const points = 69;
  const totalPoints = 350;

  const tierStyle: Record<
    'Bronze' | 'Silver' | 'Gold',
    {
      icon: string;
      primaryColor: string;
      secondaryColor: string;
      next: 'Silver' | 'Gold';
    }
  > = {
    Bronze: {
      icon: 'bronze-icon.svg',
      primaryColor: 'perx-rust',
      secondaryColor: 'perx-sunset',
      next: 'Silver',
    },
    Silver: {
      icon: 'bronze-icon.svg',
      primaryColor: 'perx-silver',
      secondaryColor: 'perx-silver',
      next: 'Gold',
    },
    Gold: {
      icon: 'gold-icon.svg',
      primaryColor: 'perx-gold',
      secondaryColor: 'perx-gold',
      next: 'Gold',
    },
  };

  return (
    <section className="flex h-full flex-col overflow-x-hidden">
      <Header name={name} />
      <main
        className={`bg-${tierStyle[tier].secondaryColor}/15 flex grow flex-col`}
      >
        <LoyaltyRewardsCard
          nextIcon={tierStyle[tierStyle[tier].next].icon}
          icon={tierStyle[tier].icon}
          primary={tierStyle[tier].primaryColor}
          tier={tier}
          rank={rank}
          points={points}
          totalPoints={totalPoints}
        />
      </main>
    </section>
  );
}

function Header({ name }: { name: string }) {
  return (
    <header className="bg-perx-rust flex h-[240px] items-start justify-between px-4 pt-4 md:px-6">
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
  icon,
  primary,
  nextIcon,
  tier,
  rank,
  points,
  totalPoints,
}: {
  icon: string;
  primary: string;
  nextIcon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  rank: 'I' | 'II' | 'III';
  points: number;
  totalPoints: number;
}) {
  return (
    <div className="bg-perx-white relative -top-28 flex aspect-[9/4] h-auto w-[90%] max-w-[800px] flex-col items-center justify-evenly gap-4 self-center rounded-xl px-4 py-4 shadow-sm md:w-4/5 md:px-12">
      <div className="flex flex-col items-center gap-1">
        <img src={icon} alt="Tier icon" className="size-14" />
        <h2 className={`text-${primary} font-mono font-bold`}>
          {`${tier} ${rank}`}
        </h2>
      </div>
      <div className="text-perx-black flex w-full items-center gap-3">
        <SparklesIcon className={`text-${primary}`} size={40} />
        <h1 className="font-mono text-4xl font-medium sm:text-5xl md:text-6xl">
          {`${points} `}
          <span className="text-muted-foreground font-sans text-base font-normal tracking-tighter">
            points remaining
          </span>
        </h1>
      </div>
      <div className="flex w-full flex-col justify-start gap-0">
        <h3 className="text-muted-foreground relative top-2.25 m-0 p-0 text-base/tight tracking-tighter">
          Total points you earned
        </h3>
        <div className="mt-4 flex w-full items-center gap-3">
          <h3 className="font-mono">{`${totalPoints}`}</h3>
          <div className="w-full">
            <Progress
              value={350}
              indicatorClass="bg-perx-rust"
              max={1000}
              className="h-3"
            />
          </div>
          <h3 className="font-mono">1000</h3>
          <img src={nextIcon} alt="Next tier icon" className="size-6" />
        </div>
      </div>
    </div>
  );
}
