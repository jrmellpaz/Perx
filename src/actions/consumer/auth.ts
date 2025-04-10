'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  LoginConsumerInputs,
  ConsumerFormInputs,
} from '@/lib/consumer/consumerSchema';
import { checkAchievements } from './achievements';

export async function loginConsumer(data: LoginConsumerInputs) {
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

  // const { data: userData, error: userError } = await supabase
  //   .from('users')
  //   .select('role')
  //   .eq('id', userId)
  //   .single();

  // if (userError || !userData) {
  //   await supabase.auth.signOut();
  //   return { error: 'Please log in with a consumer account.' };
  // }

  revalidatePath('/explore');
  redirect('/explore');
}

export async function signupConsumer(data: ConsumerFormInputs) {
  const supabase = await createClient();

  const { name, email, password, confirmPassword, referrer_code, interests } =
    data;

  console.log('Signup data:', data); // Log the signup data

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
    // console.error('Auth error:', authError); // Log the full auth error response
    return { error: authError.message };
  }

  const userId = authData?.user?.id;
  if (!userId) {
    // console.error('Failed to retrieve user ID'); // Log the user ID retrieval failure
    return { error: 'Failed to retrieve user ID.' };
  }

  // const { error: dbError } = await supabase.from('users').insert([
  //   {
  //     id: userId,
  //   },
  // ]);

  // if (dbError) {
  //   // console.error('DB error:', dbError.message); // Log the DB error
  //   return { error: dbError.message };
  // }

  const unique_code = await generateUniqueCode();

  const { error: db2Error } = await supabase.from('consumers').insert([
    {
      id: userId,
      email: email,
      referrer_code,
      interests,
      name,
      referral_code: unique_code,
      has_purchased: false,
    },
  ]);

  if (db2Error) {
    // console.error('DB2 error:', db2Error.message); // Log the DB2 error
    return { error: db2Error.message };
  }

  const { error: db3Error } = await supabase
    .from('consumer_achievements')
    .insert([
      {
        id: userId,
        achievement_id: [],
      },
    ]);

  if (db3Error) {
    // console.error('DB2 error:', db2Error.message); // Log the DB2 error
    return { error: db3Error.message };
  }

  if (referrer_code) {
    const { data: checkData, error: checkError } = await supabase
      .from('consumers')
      .select('id')
      .eq('referral_code', referrer_code)
      .single();
    checkAchievements(checkData?.id); // Call the function to check achievements
  }
  // Fetch the user's role
  // const { data: roleData, error: roleError } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('user_id', userId)
  //   .single();

  // let redirectUrl;

  // if (roleError) {
  //   console.error('Error fetching user role:', roleError);
  //   redirectUrl = '/home'; // Default to home if there's an error
  // } else {
  //   // Determine the redirect URL based on the user's role
  //   if (roleData.role === 'consumer') {
  //     redirectUrl = '/home';
  //   } else {
  //     redirectUrl = '/merchant/dashboard';
  //   }
  // }

  // // Now you can use redirectUrl in your confirmation link
  // const confirmationLink = `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&redirect_to=${redirectUrl}`;
  // console.log('Confirmation link:', confirmationLink); // Log the confirmation link

  revalidatePath('/explore');
  redirect('/explore');
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

  const { data: userData, error: userError } = await supabase
    .from('consumers')
    .select('id')
    .eq('email', email);

  if (userData) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url,
    });
  } else {
    throw new Error(userError.message);
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

export async function checkReferrer(referrerCode: string): Promise<boolean> {
  const supabase = await createClient();

  if (!referrerCode?.trim()) {
    return true;
  }

  // console.log("indsddedi")
  const { data, error } = await supabase
    .from('consumers')
    .select('id')
    .eq('referral_code', referrerCode)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

function generateReferralCode(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referralCode = '';
  for (let i = 0; i < length; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  console.log(referralCode);
  return referralCode;
}

async function isCodeUnique(code: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consumers')
    .select('referral_code')
    .eq('referral_code', code);

  return data?.length === 0;
}

export async function generateUniqueCode(): Promise<string> {
  let referralCode: string = '';
  let uniqueCode = false;

  while (!uniqueCode) {
    referralCode = generateReferralCode(8); // Generate a referral code of length 8
    uniqueCode = await isCodeUnique(referralCode);
  }

  return referralCode;
}

export const fetchTopCouponTypes = async (): Promise<string[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_coupon_types');

  if (error) {
    console.error('Error fetching coupon types:', error);
    return [];
  }

  // console.log('Fetched coupon types:', data);

  return (data as { type: string; count: number }[]).map((item) => item.type);
};
