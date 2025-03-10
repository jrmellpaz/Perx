'use server';

import { createClient } from '@/utils/supabase/server';

export interface UserProfile {
  name: string;
  level: string;
  points: number;
  referralCode: string;
}

export async function fetchConsumerProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('consumers')
    .select('name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    name: data.name,
    level: "Diamond",
    points: 165,
    referralCode: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  };
}

export async function updateConsumerProfile(name: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('consumers')
    .update({ name })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
}
