'use server';

import { createClient } from '@/utils/supabase/server';

import type { Rank, Ranks } from '@/lib/types';

export const fetchRanks = async (): Promise<Ranks> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ranks')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    return data as Ranks;
  } catch (error) {
    console.error('Fetch Consumer Ranks Error:', error);
    return [];
  }
};

export const fetchRank = async (rankId: number): Promise<Rank> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ranks')
    .select('*')
    .eq('id', Number(rankId))
    .single();

  if (error) {
    console.error(`Failed to fetch rank: ${error.message}`);
  }

  if (!data) {
    throw new Error('Rank not found');
  }

  return {
    rank: data.rank,
    max_points: data.max_points,
    icon: data.icon,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    created_at: data.created_at,
    id: data.id,
  } as Rank;
};

export const levelUpConsumerRank = async (consumerId: string) => {
  try {
    const supabase = await createClient();

    //get all ranks ordered by max_points (ascending)
    const { data: ranks, error: ranksError } = await supabase
      .from('ranks')
      .select('id, max_points')
      .order('id', { ascending: true });

    if (ranksError) throw new Error(ranksError.message);
    if (!ranks || ranks.length === 0) throw new Error('No ranks found');

    //get current consumer data
    const { data: consumer, error: consumerError } = await supabase
      .from('consumers')
      .select('points_total, rank')
      .eq('id', consumerId)
      .single();

    if (consumerError) throw new Error(consumerError.message);
    if (!consumer) throw new Error('Consumer not found');

    const currentPoints = consumer.points_total;
    const currentRankId = consumer.rank;

    // Find the index of the current rank
    const currentRankIndex = ranks.findIndex(
      (rank) => rank.id === currentRankId
    );
    if (currentRankIndex === -1)
      throw new Error('Current rank not found in ranks list');

    // Check if the user qualifies for a higher rank
    let newRankIndex = currentRankIndex;
    // console.log('gawas sa loop');
    for (let i = currentRankIndex; i < ranks.length; i++) {
      // console.log('sulod sa loop');
      // console.log(
      //   'current points sa gawas:',
      //   currentPoints,
      //   'max points:',
      //   ranks[i].max_points
      // );
      if (currentPoints >= ranks[i].max_points) {
        // console.log(
        //   'current points:',
        //   currentPoints,
        //   'max points:',
        //   ranks[i].max_points
        // );
        newRankIndex = i + 1;
      } else {
        break; // Stop checking once the user no longer qualifies
      }
    }

    const newRankId = ranks[newRankIndex].id;

    console.log(
      'Current Points:',
      currentPoints,
      'Current Rank:',
      currentRankId,
      newRankId,
      'ranks',
      ranks
    );

    //if rank changed, update the consumer
    if (newRankId !== currentRankId) {
      const { error: updateError } = await supabase
        .from('consumers')
        .update({ rank: newRankId })
        .eq('id', consumerId);

      if (updateError) throw new Error(updateError.message);
    }
    return {
      leveledUp: true,
    };

    return { leveledUp: false };
  } catch (error) {
    console.error('Error leveling up consumer rank:', error);
    return {
      leveledUp: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
