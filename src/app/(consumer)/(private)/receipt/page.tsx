import { createClient } from '@/utils/supabase/server';
import ReceiptUploader from '@/components/consumer/ConsumerReceipt';
import PerxHeader from '@/components/custom/PerxHeader';

export default async function ReceiptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PerxHeader title="Upload receipt" className="bg-white shadow-md" />
      <main className="scrollable container min-h-screen bg-gray-100 flex items-center justify-center">
        <ReceiptUploader userId={user!.id} />
      </main>
    </>
  );
}
