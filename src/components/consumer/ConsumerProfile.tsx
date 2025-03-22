'use client';

import {
  CopyIcon,
  GuitarIcon,
  HandCoinsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TicketsIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { JSX } from 'react';
import { toast } from 'sonner';

type Achievement = {
  title: string;
  description: string;
  icon: JSX.Element;
  reward: string;
  achieved: boolean;
};

export function Missions({
  referral_code,
  primary,
  secondary,
}: {
  referral_code: string;
  primary: {
    text: string;
    bg: string;
  };
  secondary: {
    text: string;
    bg: string;
  };
}) {
  return (
    <section className="flex flex-col">
      <ReferralCard
        referral_code={referral_code}
        primary={primary}
        secondary={secondary}
      />
    </section>
  );
}

function ReferralCard({
  referral_code,
  primary,
  secondary,
}: {
  referral_code: string;
  primary: {
    text: string;
    bg: string;
  };
  secondary: {
    text: string;
    bg: string;
  };
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(referral_code);
    toast('Refferal code copied to clipboard.');
  };

  return (
    <div className="bg-perx-white flex items-center gap-6 rounded-lg p-4 shadow-xs">
      <p className="aspect-square h-full w-auto shrink-0 text-6xl/[80px]">😎</p>
      <div className="flex grow flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <h3 className={`font-mono font-medium`}>The more, the merrier!</h3>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 ${secondary.bg}`}
          >
            <SparklesIcon className={`${primary.text}`} size={12} />
            <p className={`font-mono ${primary.text} text-sm`}>50</p>
          </div>
        </div>
        <p className="text-accent-foreground/80 text-sm text-pretty">
          Share your referral code with friends! Earn 50 points for every friend
          who signs up using your code and makes their first coupon purchase.
        </p>
        <div
          className={`mt-2 flex items-center justify-between gap-4 border-t-1 px-2 pt-2`}
        >
          <h3>{referral_code}</h3>
          <button
            onClick={handleCopy}
            className={`${primary.text} hover:bg-muted-foreground/10 cursor-pointer rounded-full border p-2.5 transition-all hover:border-transparent`}
          >
            <CopyIcon size={14} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Achievements({
  primary,
  secondary,
}: {
  primary: { text: string; bg: string };
  secondary: { text: string; bg: string };
}) {
  const achievements = [
    {
      title: 'First purchase',
      description: 'You made your first purchase!',
      icon: <ShoppingBagIcon size={120} strokeWidth={1.1} />,
      reward: '10',
      achieved: true,
    },
    {
      title: 'Social butterfly',
      description: 'You referred 10 users.',
      icon: <UsersRoundIcon size={120} strokeWidth={1.1} />,
      reward: '50',
      achieved: false,
    },
    {
      title: 'Coupon Connoisseur',
      description: 'You redeemed 10 coupons.',
      icon: <TicketsIcon size={120} strokeWidth={1.1} />,
      reward: '50',
      achieved: false,
    },
    {
      title: 'Point Prodigy',
      description: 'You reached a balance of 1000 points.',
      icon: <HandCoinsIcon size={120} strokeWidth={1.1} />,
      reward: '20',
      achieved: false,
    },
    {
      title: 'Referral Rockstar',
      description: 'You referred 50 users.',
      icon: <GuitarIcon size={120} strokeWidth={1.1} />,
      reward: '100',
      achieved: false,
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 md:gap-4">
      {achievements.map((achievement, index) => (
        <AchievementCard
          key={index}
          achievement={achievement}
          primary={primary}
          secondary={secondary}
        />
      ))}
    </section>
  );
}

function AchievementCard({
  achievement,
  primary,
  secondary,
}: {
  achievement: Achievement;
  primary: {
    text: string;
    bg: string;
  };
  secondary: {
    text: string;
    bg: string;
  };
}) {
  const { title, description, icon, reward, achieved } = achievement;
  return (
    <div className="flex grow basis-60 flex-col gap-2 rounded-md border">
      <div
        className={`flex aspect-square h-auto w-full items-center justify-center ${achieved ? primary.text : 'text-muted-foreground/80'}`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 px-2 py-1">
        <h3 className="font-mono font-medium">{title}</h3>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 ${secondary.bg} w-fit`}
        >
          <SparklesIcon className={`${primary.text}`} size={12} />
          <p className={`font-mono ${primary.text} text-xs`}>{reward}</p>
        </div>
        <p className="text-accent-foreground/80 mt-2 text-sm text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
}
