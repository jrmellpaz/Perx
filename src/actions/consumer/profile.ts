'use server';
import {
  EditProfileInputs,
  ConsumerProfile,
} from '@/lib/consumer/profileSchema';
import { createClient } from '@/utils/supabase/server';

export async function getConsumerProfile(id: string): Promise<ConsumerProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('consumers')
    .select(
      'name, referral_code, interests, rank, points_balance, points_total'
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Failed to fetch consumer profile: ${error.message}`);
  }

  if (!data) {
    throw new Error('Consumer profile not found');
  }

  return {
    name: data.name,
    referralCode: data.referral_code,
    interests: data.interests,
    rank: data.rank,
    balancePoints: data.points_balance,
    totalPoints: data.points_total,
  } as ConsumerProfile;
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

export async function deleteAccount(userId: string) {
  const supabase = await createClient();

  try {
    // Start a transaction: Delete user data first

    const { error: userError } = await supabase
      .from('users') // Change this to your user table
      .delete()
      .eq('id', userId);

    if (userError) throw new Error(userError.message);

    // await supabase.auth.signOut();

    // Delete user authentication
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw new Error(authError.message);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
