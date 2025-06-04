import { createClient } from '@/utils/supabase/server';
import ReceiptUploader from '@/components/consumer/ConsumerReceipt';
import PerxHeader from '@/components/custom/PerxHeader';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload receipt',
};

export default async function ReceiptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PerxHeader title="Upload receipt" className="bg-white shadow-md" />
      <main className="scrollable container flex min-h-screen items-center justify-center bg-gray-100">
        <ReceiptUploader userId={user!.id} />
      </main>
    </>
  );
}
