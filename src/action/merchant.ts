'use server';

import connectDB from '@/lib/db';
import Merchant from '@/lib/merchantAuth/merchant';
import {
  LoginMerchantInputs,
  MerchantFormInputs,
} from '@/lib/merchantAuth/merchantSchema';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { CredentialsSignin } from 'next-auth';
import { signIn } from '@/lib/auth';

const loginMerchant = async (data: LoginMerchantInputs) => {
  const { email, password } = data;

  try {
    await signIn('Merchant credentials', {
      redirect: false,
      callbackUrl: '/merchant/dashboard',
      email,
      password,
    });
  } catch (error) {
    throw new Error(`Invalid email or password`);
  } finally {
    redirect('/merchant/dashboard');
  }
};

const registerMerchant = async (data: MerchantFormInputs) => {
  const { businessName, email, password, description, address, logo } = data;

  if (
    !businessName ||
    !email ||
    !password ||
    !description ||
    !address ||
    !logo
  ) {
    throw new Error('All fields cannot be empty');
  }

  console.log('Connecting to database...');
  await connectDB();
  console.log('Connected to database');

  // Check existing merchant
  const existingMerchant = await Merchant.findOne({ email });
  if (existingMerchant) {
    throw new Error('Merchant already exists. Log in instead.');
  }

  const hashedPassword = await hash(password, 12);

  await Merchant.create({
    businessName,
    email,
    password: hashedPassword,
    description,
    address,
    // logo,
  });
  console.log('Merchant created successfully');
  redirect('/merchant/login');
};

export { registerMerchant, loginMerchant };
