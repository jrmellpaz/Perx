'use client';

import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export default function MerchantPasswordRecovery() {
  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Recover password</h1>
      <form className="flex h-full flex-col justify-between">
        <motion.div
          initial={{ x: '50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col gap-6"
        >
          <p className="font-mono">
            A recovery link will be sent to your email.
          </p>
          <PerxInput
            label="Email address"
            type="email"
            placeholder="business@example.com"
            required
          />
        </motion.div>
        <div className="flex w-full justify-end">
          <Button type="submit">Proceed</Button>
        </div>
      </form>
    </section>
  );
}
