'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  LoginConsumerInputs,
  ConsumerFormInputs,
} from '@/lib/consumerAuth/consumerSchema';

export async function loginConsumer(data: LoginConsumerInputs) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(data);

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData?.user?.id;
  if (!userId) {
    throw new Error("Failed to retrieve user ID.");
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    await supabase.auth.signOut();
    throw new Error("Please log in with a consumer account.")
  }

  revalidatePath('/home');
  redirect('/home');
}

export async function signupConsumer(data: ConsumerFormInputs) {
  const supabase = await createClient();

  const {
    email,
    password,
    confirmPassword,
    referralCode,
    interests,
    otherInterests,
  } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData?.user?.id;
  if (!userId) {
    throw new Error("Failed to retrieve user ID.");
  }

  const { error: dbError } = await supabase.from('users').insert([
    {
      id: userId,
    },
  ]);

  if (dbError) {
    throw new Error(dbError.message);
  }

  const { error: db2Error } = await supabase.from('consumers').insert([
    {
      id: userId,
      email: email,
      referralCode,
      interests,
    },
  ]);

  if (db2Error) {
    throw new Error(db2Error.message);
  }

  revalidatePath('/home');
  redirect('/home');
}

export async function logoutConsumer() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function recoverPassword(email: string) {
  const supabase = await createClient();
  const url = `${process.env.NEXT_PUBLIC_URL}/change-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: url,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function changePassword(password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}
