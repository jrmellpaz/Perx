'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  LoginConsumerInputs,
  ConsumerFormInputs,
} from '@/lib/consumer/consumerSchema';

export async function loginConsumer(data: LoginConsumerInputs) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword(data);

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData?.user?.id;
  if (!userId) {
    return { error: "No such consumer account." };
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    await supabase.auth.signOut();
    return { error: "Please log in with a consumer account." };
  }

  revalidatePath('/home');
  redirect('/home');
}

export async function signupConsumer(data: ConsumerFormInputs) {
  const supabase = await createClient();

  const {
    name,
    email,
    password,
    confirmPassword,
    referralCode,
    interests,
  } = data;

  console.log('Signup data:', data); // Log the signup data

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    // console.error('Auth error:', authError); // Log the full auth error response
    return { error: authError.message };
  }

  const userId = authData?.user?.id;
  if (!userId) {
    // console.error('Failed to retrieve user ID'); // Log the user ID retrieval failure
    return { error: "Failed to retrieve user ID." };
  }

  const { error: dbError } = await supabase.from('users').insert([
    {
      id: userId,
    },
  ]);

  if (dbError) {
    // console.error('DB error:', dbError.message); // Log the DB error
    return { error: dbError.message };
  }

  const { error: db2Error } = await supabase.from('consumers').insert([
    {
      id: userId,
      email: email,
      referralCode,
      interests,
      name,
    },
  ]);

  if (db2Error) {
    // console.error('DB2 error:', db2Error.message); // Log the DB2 error
    return { error: db2Error.message };
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

  const { data: userData, error: userError } = await supabase
    .from('consumers')
    .select('id')
    .eq('email', email)

  if (userData) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: url,
  });

  }
  else {
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


// // Function to generate a referral code (alphanumeric)
// function generateReferralCode(length: number): string {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let referralCode = '';
//   for (let i = 0; i < length; i++) {
//     referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   console.log(referralCode)
//   return referralCode;
// }

// // Function to check if the referral code exists in the database
// async function isCodeUnique(code: string): Promise<boolean> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from('referrals')
//     .select('code')
//     .eq('code', code);

//   return data?.length === 0; // if length is 0, code is unique
// }

// // Main function to generate and save referral code
// async function generateAndSaveReferralCode(userId: string): Promise<void> {
//   const supabase = await createClient();
//   let referralCode: string = '';
//   let uniqueCode = false;

//   while (!uniqueCode) {
//     referralCode = generateReferralCode(8); // Generate a referral code of length 8
//     uniqueCode = await isCodeUnique(referralCode);
//   }

//   // Save to Supabase
//   const { data, error } = await supabase
//     .from('referrals')
//     .insert([{ user_id: userId, code: referralCode, used: false }]);

//   if (error) {
//     console.error('Error saving referral code:', error);
//   } else {
//     console.log('Referral code saved:', referralCode);
//   }
// }

// // Usage example
// generateAndSaveReferralCode('user123');
