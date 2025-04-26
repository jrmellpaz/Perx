'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface ResponsiveMenuProps {
  open: boolean;
}

export default function ResponsiveMenu({ open }: ResponsiveMenuProps) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 z-20 h-screen w-full"
        >
          <div className="bg-perx-crimson text-perx-white m-6 rounded-3xl py-10 font-mono text-xl">
            <ul className="flex flex-col items-center justify-center gap-10">
              {/* <li>Log in as</li>
              <Link href="/merchant/login" className="font-bold">
                MERCHANT
              </Link>
              <Link href="/login" className="font-bold">
                CONSUMER
              </Link> */}
              <li>Home</li>
              <li>About</li>
              <Link href="/explore">Explore</Link>
              <li>Features</li>
              <li>FAQs</li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
