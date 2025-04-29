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
