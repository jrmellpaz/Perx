'use server';
import { EditProfileInputs } from '@/lib/merchantSchema';
import { createClient } from '@/utils/supabase/server';

import type { Merchant } from '@/lib/types';

export const fetchMerchantProfile = async (
  merchantId: string
): Promise<Merchant> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (error) {
    console.error(`Failed to fetch merchant profile: ${error.message}`);
  }

  return data as Merchant;
};

export const updateMerchantProfile = async (
  profileData: EditProfileInputs
): Promise<void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('merchants')
    .update(profileData)
    .eq('id', user!.id);

  if (error) {
    console.error(`Failed to update merchant profile: ${error.message}`);
  }
};
