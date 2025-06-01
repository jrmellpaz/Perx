'use server';
import { EditProfileInputs } from '@/lib/merchantSchema';
import { createClient } from '@/utils/supabase/server';
import type { Merchant } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const fetchMerchant = async (merchantId: string): Promise<Merchant> => {
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
  profileData: EditProfileInputs,
  logo: string
): Promise<void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  let logoUrl: string = logo;
  const newLogo: File | null = profileData.logo[0];
  console.log('Updating merchant profile with data:', profileData);

  if (newLogo) {
    const { data: newLogoData, error: updateLogoError } = await supabase.storage
      .from('perx')
      .update(`logo/${user.id}`, newLogo);

    if (updateLogoError) {
      throw new Error(`Failed to update logo: ${updateLogoError.message}`);
    }

    const { data: url } = supabase.storage
      .from('perx')
      .getPublicUrl(newLogoData.path);

    logoUrl = url.publicUrl;
  }

  // Generate text_search (tsvector)
  const textToSearch =
    `${profileData.name} ${profileData.bio} ${profileData.address}`.trim();

  const { error } = await supabase
    .from('merchants')
    .update({
      name: profileData.name,
      bio: profileData.bio,
      address: profileData.address,
      logo: logoUrl,
      text_search: textToSearch,
    })
    .eq('id', user!.id);

  if (error) {
    console.error(`Failed to update merchant profile: ${error.message}`);
  }

  revalidatePath('/merchant/profile/coupons');
};
