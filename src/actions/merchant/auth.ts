'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  LoginMerchantInputs,
  MerchantFormInputs,
} from '@/lib/merchant/merchantSchema';

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

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  // Supabase auth
  const { data: merchantData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(`AUTH ERROR: ${authError.message}`);
  }

  // Insert in public.users table
  const merchantId = merchantData?.user?.id;
  if (!merchantId) {
    throw new Error('Failed to retrieve merchant ID.');
  }

  const { error: usersTableError } = await supabase
    .from('users')
    .insert({ id: merchantId, role: 'merchant' });

  if (usersTableError) {
    throw new Error(`USERS TABLE ERROR: ${usersTableError.message}`);
  }

  // Store logo in storage and retrieve link
  const { data: logoData, error: logoError } = await supabase.storage
    .from('perx')
    .upload(`logo/${merchantId}`, logo[0]);

  if (logoError) {
    throw new Error(`LOGO ERROR: ${logoError.message}`);
  }

  const { data: logoURL } = await supabase.storage
    .from('perx')
    .getPublicUrl(`logo/${merchantId}`);

  // Insert merchant details in public.merchants table
  const { error: merchantsTableError } = await supabase
    .from('merchants')
    .insert({
      email,
      name: businessName,
      bio: description,
      address,
      logo: logoURL.publicUrl,
      id: merchantId,
    });

  if (merchantsTableError) {
    throw new Error(`MERCHANT TABLE ERROR: ${merchantsTableError.message}`);
  }

  // Redirect to dashboard
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
