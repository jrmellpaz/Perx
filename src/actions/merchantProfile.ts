'use server';
import {
  EditProfileInputs,
  MerchantProfile,
} from '@/lib/merchant/profileSchema';
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

export async function updateMerchantProfile(profileData: EditProfileInputs) {
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
}

export async function updateMerchantPassword() {
  const supabase = await createClient();
  const { data: merchantData } = await supabase.auth.getUser();
  const url = `${process.env.NEXT_PUBLIC_URL}/merchant/change-password`;

  if (!merchantData?.user?.email) {
    throw new Error('No email found');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    merchantData.user.email,
    {
      redirectTo: url,
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}
