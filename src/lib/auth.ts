import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from './db';
import Merchant from './merchantAuth/merchant';
import { compare } from 'bcryptjs';

interface MerchantData {
  businessName: string;
  email: string;
  role: string;
  // logo: string;
  id: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Merchant credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          throw new Error('Please enter your email and password');
        }

        await connectDB();

        const merchant = await Merchant.findOne({ email }).select(
          '+password +role'
        );

        if (!merchant || !merchant.password) {
          throw new Error('Invalid email or password');
        }

        const isMatched = await compare(password, merchant.password);

        if (!isMatched) {
          throw new Error('Invalid email or password');
        }

        const merchantData: MerchantData = {
          businessName: merchant.businessName,
          email: merchant.email,
          // logo: merchant.logo,
          role: merchant.role,
          id: merchant._id,
        };

        return merchantData;
      },
    }),
  ],
  pages: {
    signIn: '/merchant/login',
  },
});
