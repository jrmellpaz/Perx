'use server';
import { createClient } from '@/utils/supabase/server';

import type { Achievements } from '@/lib/types';

export const fetchAchievements = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Achievements;
};
