'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { LoginMerchantInputs, MerchantFormInputs } from '@/lib/merchantSchema';
import { logoutConsumer } from './consumerAuth';
import { embedText } from './embedder';

export const loginMerchant = async (data: LoginMerchantInputs) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  type UserRole = 'merchant' | 'consumer';

  const userRole: UserRole = user?.user_metadata.role as UserRole;

  if (!user) {
    throw new Error('No such merchant account.');
  } else if (userRole !== 'merchant') {
    logoutConsumer();
    throw new Error('No such merchant account.');
  }

  revalidatePath('/merchant/dashboard');
  redirect('/merchant/dashboard');
};

export const signupMerchant = async (data: MerchantFormInputs) => {
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

  // Pass user credentials and set role to merchant
  const { data: merchantData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'merchant',
      },
    },
  });

  if (authError) {
    throw new Error(`Auth error: ${authError.message}`);
  }

  // Store logo in storage and retrieve link
  const merchantId = merchantData?.user?.id;
  if (!merchantId) {
    throw new Error('Failed to retrieve merchant ID.');
  }

  const { data: logoData, error: logoError } = await supabase.storage
    .from('perx')
    .upload(`logo/${merchantId}`, logo[0]);

  if (logoError) {
    throw new Error(`Logo error: ${logoError.message}`);
  }

  const { data: logoUrl } = await supabase.storage
    .from('perx')
    .getPublicUrl(logoData.path);

   // Generate text_search (tsvector)
   const textToSearch = `${businessName} ${description} ${address}`.trim();

   // Generate embedding (vector)
   const embedding = await embedText(textToSearch);

  // Insert merchant details in public.merchants table
  const { error: merchantsTableError } = await supabase
    .from('merchants')
    .insert({
      email,
      name: businessName,
      bio: description,
      address,
      logo: logoUrl.publicUrl,
      id: merchantId,
      // embedding: embedding,
      text_search: textToSearch,
    });

  if (merchantsTableError) {
    throw new Error(`Merchant table error: ${merchantsTableError.message}`);
  }

  // Redirect to dashboard
  revalidatePath('/merchant/dashboard');
  redirect('/merchant/dashboard');
};

export const logoutMerchant = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/merchant/login');
};

export const recoverPassword = async (email: string) => {
  const supabase = await createClient();
  const url = `${process.env.NEXT_PUBLIC_URL}/merchant/change-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: url,
  });

  if (error) {
    throw new Error(error.message);
  }
};
