'use client';

import Link from 'next/link';
import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PerxAlert from '../custom/PerxAlert';
import { createClient } from '@/utils/supabase/server';
import { recoverPassword } from '@/actions/merchant/auth';

export default function MerchantPasswordRecovery() {
  const [success, setSuccess] = useState<boolean>(false);

  const handlePasswordRecovery = async (formData: FormData) => {
    const email = formData.get('email') as string;
    await recoverPassword(email);
    console.log(email);
    // Implement password recovery logic here
    setSuccess(true);
  };

  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Recover password</h1>
      <form
        className="flex h-full flex-col justify-between"
        action={handlePasswordRecovery}
      >
        <motion.div
          initial={{ x: '50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col gap-6"
        >
          {success ? (
            <PerxAlert
              variant="success"
              heading="Success"
              message="The recovery link is sent to your email."
            />
          ) : (
            <p className="font-mono">
              A recovery link will be sent to your email.
            </p>
          )}
          <PerxInput
            label="Email address"
            type="email"
            placeholder="business@example.com"
            name="email"
            required
          />
        </motion.div>
        <div className="flex w-full justify-end">
          <Link href="/merchant/login">
            <Button variant={'link'}>Return to login</Button>
          </Link>
          <Button type="submit">Proceed</Button>
        </div>
      </form>
    </section>
  );
}
