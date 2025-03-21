'use server';
import {
  EditProfileInputs,
  ConsumerProfile,
} from '@/lib/consumer/profileSchema';
import { createClient } from '@/utils/supabase/server';

export async function getConsumerProfile(
  id: string
): Promise<ConsumerProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('consumers')
    .select('name, referral_code, interests')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Failed to fetch consumer profile: ${error.message}`);
  }

  return data as ConsumerProfile;
}

export async function updateConsumerProfile(profileData: EditProfileInputs) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('consumers')
    .update(profileData)
    .eq('id', user!.id);

  if (error) {
    console.error(`Failed to update consumer profile: ${error.message}`);
  }
}

export async function updateConsumerPassword() {
  const supabase = await createClient();
  const { data: consumerData } = await supabase.auth.getUser();
  const url = `${process.env.NEXT_PUBLIC_URL}/change-password`;

  if (!consumerData?.user?.email) {
    throw new Error('No email found');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    consumerData.user.email,
    {
      redirectTo: url,
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}
