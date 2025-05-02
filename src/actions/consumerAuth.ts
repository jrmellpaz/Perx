'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { LoginConsumerInputs, ConsumerFormInputs } from '@/lib/consumerSchema';
import { nanoid } from 'nanoid';
import { logoutMerchant } from './merchantAuth';
import { Category } from '@/lib/types';

export const loginConsumer = async (
  data: LoginConsumerInputs,
  { redirectUrl }: { redirectUrl: string }
) => {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword(data);

  if (authError) {
    return { error: authError.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  type UserRole = 'merchant' | 'consumer';

  const userRole: UserRole = user?.user_metadata.role as UserRole;

  if (!user) {
    return { error: 'No consumer account exists.' };
  } else if (userRole !== 'consumer') {
    logoutMerchant();
    return { error: 'No consumer account exists.' };
  }

  revalidatePath(redirectUrl);
  redirect(redirectUrl);
};

export const signupConsumer = async (
  data: ConsumerFormInputs,
  { redirectUrl }: { redirectUrl: string }
) => {
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
      referrer_code: referrerCode,
      interests: interests.map((interest) => interest as Category),
      name,
      referral_code: uniqueCode,
      has_purchased: false,
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
  }
  console.log('Auth data:', authData, authError);

  revalidatePath(redirectUrl);
  redirect(redirectUrl);
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

export const updatePassword = async (): Promise<void> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user?.email) {
    throw new Error('No email found');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    userData.user.email
  );

  if (error) {
    throw new Error(error.message);
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
