'use server';
import { MerchantProfile } from '@/lib/merchant/profileSchema';
import { createClient } from '@/utils/supabase/server';

export async function getMerchantProfile(
  merchantId: string
): Promise<MerchantProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('merchants')
    .select('name, email, bio, address, logo')
    .eq('id', merchantId)
    .single();

  if (error) {
    console.error(`Failed to fetch merchant profile: ${error.message}`);
  }

  return data as MerchantProfile;
}
