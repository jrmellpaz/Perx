import { fetchAchievements } from '@/actions/achievements';
import { fetchConsumerProfile } from '@/actions/consumerProfile';
import { fetchRank } from '@/actions/rank';
import { createClient } from '@/utils/supabase/server';
import { Suspense } from 'react';

import type { Achievement } from '@/lib/types';

export default async function Achievements() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { rank } = await fetchConsumerProfile(user!.id);
  const { primary_color, secondary_color } = await fetchRank(rank);

  const achievements = await fetchAchievements();

  return (
    <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
      <Suspense fallback={<AchievementCardSkeleton />}>
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={index}
            achieved
            achievement={achievement}
            primary={primary_color}
            secondary={secondary_color}
          />
        ))}
      </Suspense>
    </section>
  );
}

function AchievementCard({
  achievement,
  achieved = false,
  primary,
  secondary,
}: {
  achievement: Achievement;
  achieved: boolean;
  primary: string;
  secondary: string;
}) {
  const { name, description, points } = achievement;

  return (
    <div className="bg-perx-white flex grow basis-60 flex-col gap-2 rounded-md p-2 shadow-md">
      {/* <div
          style={{
            color: achieved ? primary : 'rgba(0, 0, 0, 0.5)',
          }}
          className="flex aspect-square h-auto w-full items-center justify-center"
        >
          {icon}
        </div> */}
      <div className="flex flex-col gap-0.5 px-2 py-1">
        <h3 className="font-mono font-medium">{name}</h3>
        <div
          style={{
            backgroundColor: `${secondary}33`,
          }}
          className="flex w-fit items-center gap-1 rounded-full px-3 py-1"
        >
          <img
            src="/reward-points.svg"
            alt="Reward Points"
            width={14}
            height={14}
            className="pb-0.25"
          />
          <p
            style={{
              color: primary,
            }}
            className="font-mono text-xs font-medium"
          >
            {points}
          </p>
        </div>
        <p className="text-accent-foreground/80 mt-2 text-sm text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
}

function AchievementCardSkeleton() {
  return (
    <div className="bg-perx-white flex grow basis-60 flex-col gap-2 rounded-md p-2 shadow-md">
      <div className="bg-muted flex aspect-square h-auto w-full animate-pulse items-center justify-center"></div>
      <div className="flex flex-col gap-0.5 px-2 py-1">
        <div className="bg-muted h-6 w-3/4 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}
