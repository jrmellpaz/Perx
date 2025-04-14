'use server';
import { EditProfileInputs } from '@/lib/merchantSchema';
import { createClient } from '@/utils/supabase/server';

import type { Merchant } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

  if (!user) {
    throw new Error('User not authenticated');
  }

  const logo = profileData.logo[0];
  const { data: newLogoData, error: updateLogoError } = await supabase.storage
    .from('perx')
    .update(`logo/${user.id}`, logo);

  if (updateLogoError) {
    throw new Error(`Failed to update logo: ${updateLogoError.message}`);
  }

  const { data: logoUrl } = supabase.storage
    .from('perx')
    .getPublicUrl(newLogoData.path);

  const { error } = await supabase
    .from('merchants')
    .update({
      name: profileData.name,
      bio: profileData.bio,
      address: profileData.address,
      logo: logoUrl.publicUrl,
    })
    .eq('id', user!.id);

  if (error) {
    console.error(`Failed to update merchant profile: ${error.message}`);
  }

  revalidatePath('/merchant/profile/coupons');
};
