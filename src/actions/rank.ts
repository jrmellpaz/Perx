import { Rank } from '@/lib/consumer/rankSchema';
import { createClient } from '@/utils/supabase/server';

export async function fetchRanks() {
  type Ranks = Pick<Rank, 'id' | 'rank' | 'icon'>[];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ranks')
      .select('id, rank, icon')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    return data as Ranks;
  } catch (error) {
    console.error('Fetch Consumer Ranks Error:', error);
    return [];
  }
}

export async function fetchRank(rankId: string): Promise<Rank> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ranks')
    .select('rank, max_points, icon')
    .eq('id', rankId)
    .single();

  if (error) {
    console.error(`Failed to fetch rank: ${error.message}`);
  }

  if (!data) {
    throw new Error('Rank not found');
  }

  return {
    rank: data.rank,
    maxPoints: data.max_points,
    icon: data.icon,
  } as Rank;
}
