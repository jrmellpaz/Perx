'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { LoginConsumerInputs, ConsumerFormInputs } from '@/lib/consumerSchema';
import { nanoid } from 'nanoid';

export const loginConsumer = async (data: LoginConsumerInputs) => {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword(data);

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData?.user?.id;
  if (!userId) {
    return { error: 'No such consumer account.' };
  }

  revalidatePath('/explore');
  redirect('/explore');
};

export const signupConsumer = async (data: ConsumerFormInputs) => {
  const supabase = await createClient();

  const { name, email, password, referrerCode, interests } = data;

  console.log('Signup data:', data);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'consumer',
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData?.user?.id;
  if (!userId) {
    return { error: 'Failed to retrieve user ID.' };
  }

  const uniqueCode = nanoid();

  const { error: dbError } = await supabase.from('consumers').insert([
    {
      id: userId,
      email: email,
      referrerCode: referrerCode,
      interests,
      name,
      referralCode: uniqueCode,
      hasPurchased: false,
    },
  ]);

  if (dbError) {
    return { error: dbError.message };
  }

  if (referrerCode) {
    const { data: checkData, error: checkError } = await supabase
      .from('consumers')
      .select('id')
      .eq('referral_code', referrerCode)
      .single();

    if (!checkData) {
      return { error: 'Referrer code not found.' };
    }

    // checkAchievements(checkData?.id);
  }

  revalidatePath('/explore');
  redirect('/explore');
};

export const logoutConsumer = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/login');
};

export const recoverPassword = async (email: string) => {
  const supabase = await createClient();
  const url = `/change-password`;

  const { data: userData, error: userError } = await supabase
    .from('consumers')
    .select('id')
    .eq('email', email);

  if (userData) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url,
    });

    if (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error(userError.message);
  }
};

export const changePassword = async (password: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (
    error &&
    !error.message.includes(
      'supabase.auth.getSession() or from some supabase.auth.onAuthStateChange()'
    ) &&
    !error.message.includes('NEXT_REDIRECT')
  ) {
    console.error('Error changing password:', error.message);
  }
};

export const checkReferrer = async (referrerCode: string): Promise<boolean> => {
  const supabase = await createClient();

  if (!referrerCode?.trim() || referrerCode.length !== 21) {
    // Default length of nanoid is 21
    return false;
  }

  const { data, error } = await supabase
    .from('consumers')
    .select('id')
    .eq('referral_code', referrerCode)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
};

// TODO: Remove
export const fetchTopCouponTypes = async (): Promise<string[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_coupon_types');

  if (error) {
    console.error('Error fetching coupon types:', error);
    return [];
  }

  return (data as { type: string; count: number }[]).map((item) => item.type);
};
