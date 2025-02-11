'use client';

import Link from 'next/link';
import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PerxAlert from '../custom/PerxAlert';
import { recoverPassword } from '@/actions/consumer/auth';
import { LoaderCircle } from 'lucide-react';

export default function ConsumerPasswordRecovery() {
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePasswordRecovery = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      await recoverPassword(email);
      console.log(email);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Recover password</h1>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={handlePasswordRecovery}
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
            autofocus={true}
          />
        </motion.div>
        <div className="flex w-full justify-end">
          <Link href="/merchant/login">
            <Button variant={'link'}>Return to login</Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle
                  className="-ms-1 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Processing
              </>
            ) : (
              'Proceed'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
