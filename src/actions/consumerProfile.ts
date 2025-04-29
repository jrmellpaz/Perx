'use server';

import { Category, Consumer, SuccessResponse } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';

import type { EditProfileInputs } from '@/lib/consumerSchema';

export const fetchConsumerProfile = async (
  consumerId: string
): Promise<Consumer> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consumers')
    .select('*')
    .eq('id', consumerId)
    .single();

  if (error) {
    console.error(`Failed to fetch consumer profile: ${error.message}`);
  }

  if (!data) {
    throw new Error('Consumer profile not found');
  }

  return data as Consumer;
};

export const updateConsumerProfile = async (
  profileData: EditProfileInputs
): Promise<void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No user found');
  }

  const { error } = await supabase
    .from('consumers')
    .update({
      ...profileData,
      interests:
        profileData.interests?.map((interest) => interest as Category) || null,
    })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update consumer profile: ${error.message}`);
  }
};

export const updateConsumerPassword = async (): Promise<void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const url = `${process.env.NEXT_PUBLIC_URL}/change-password`;

  if (!user || !user.email) {
    throw new Error('No user found');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: url,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteAccount = async (
  userId: string
): Promise<SuccessResponse> => {
  try {
    const supabase = await createClient();
    const { error: userError } = await supabase
      .from('consumers')
      .delete()
      .eq('id', userId);

    if (userError) throw new Error(userError.message);

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw new Error(authError.message);

    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error(`DELETE ACCOUNT ERROR: ${error}`);
    return { success: false, message: (error as Error).message };
  }
};
