import { getConsumerProfile } from '@/actions/consumer/profile';
import { fetchRank } from '@/actions/rank';
import { createClient } from '@/utils/supabase/server';
import {
  GuitarIcon,
  HandCoinsIcon,
  ShoppingBagIcon,
  TicketsIcon,
  UsersRoundIcon,
  SparklesIcon,
} from 'lucide-react';
import { JSX } from 'react';

type Achievement = {
  title: string;
  description: string;
  icon: JSX.Element;
  reward: string;
  achieved: boolean;
};

export default async function Achievements() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { rank } = await getConsumerProfile(user!.id);
  const { primaryColor, secondaryColor } = await fetchRank(rank);

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
          primary={primaryColor}
          secondary={secondaryColor}
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
  primary: string;
  secondary: string;
}) {
  const { title, description, icon, reward, achieved } = achievement;

  return (
    <div className="bg-perx-white flex grow basis-60 flex-col gap-2 rounded-md p-2 shadow-md">
      <div
        style={{
          color: achieved ? primary : 'rgba(0, 0, 0, 0.5)', // Dynamic text color
        }}
        className="flex aspect-square h-auto w-full items-center justify-center"
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 px-2 py-1">
        <h3 className="font-mono font-medium">{title}</h3>
        <div
          style={{
            backgroundColor: `${secondary}33`,
          }}
          className="flex w-fit items-center gap-1 rounded-full px-3 py-1"
        >
          <SparklesIcon
            style={{
              color: primary,
            }}
            size={12}
          />
          <p
            style={{
              color: primary,
            }}
            className="font-mono text-xs font-medium"
          >
            {reward}
          </p>
        </div>
        <p className="text-accent-foreground/80 mt-2 text-sm text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
}
