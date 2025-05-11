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

export interface RankResult {
  currentRank: Rank | null;
  shouldAdvance: boolean;
  nextRank: Rank | null;
}

export const getConsumerRankStatus = async (
  currentPoints: number
): Promise<RankResult> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ranks')
    .select('*')
    .order('max_points', { ascending: true });

  if (error) {
    console.error('Failed to fetch ranks:', error.message);
    return {
      currentRank: null,
      shouldAdvance: false,
      nextRank: null,
    };
  }

  if (!data || data.length == 0) {
    throw new EvalError('No rank data available');
  }

  const currentIndex = [...data]
    .reverse()
    .findIndex((rank) => currentPoints >= rank.max_points);

  const trueIndex = currentIndex === -1 ? 0 : data.length - 1 - currentIndex;

  const currentRank = data[trueIndex];
  const nextRank = data[trueIndex + 1] || null;
  const shouldAdvance =
    nextRank !== null && currentPoints >= nextRank.max_points;

  return {
    currentRank,
    shouldAdvance,
    nextRank,
  };
};
