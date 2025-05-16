import { createClient } from '@/utils/supabase/server';
import ReceiptUploader from '@/components/consumer/ConsumerReceipt';

export default async function ReceiptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <title>Receipt Upload</title>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ReceiptUploader userId={user!.id} />
      </main>
    </>
  );
}
