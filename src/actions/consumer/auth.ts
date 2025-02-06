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

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
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
