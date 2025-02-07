'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  LoginMerchantInputs,
  MerchantFormInputs,
} from '@/lib/merchantAuth/merchantSchema';

export async function loginMerchant(data: LoginMerchantInputs) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/merchant/dashboard');
  redirect('/merchant/dashboard');
}

export async function signupMerchant(data: MerchantFormInputs) {
  const supabase = await createClient();

  const {
    email,
    password,
    confirmPassword,
    businessName,
    description,
    address,
    logo,
  } = data;

  console.log(logo);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/merchant/dashboard');
  redirect('/merchant/dashboard');
}

export async function logoutMerchant() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/merchant/login');
}

export async function recoverPassword(email: string) {
  const supabase = await createClient();
  const url = `${process.env.NEXT_PUBLIC_URL}/merchant/change-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: url,
  });

  if (data) {
    console.log(data);
  }
  if (error) {
    throw new Error(error.message);
  }
}

export async function changePassword(password: string) {
  console.log('hereee');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (data) {
    console.log(data);
  }
  if (error) {
    throw new Error(error.message);
  }

  await logoutMerchant();
}
