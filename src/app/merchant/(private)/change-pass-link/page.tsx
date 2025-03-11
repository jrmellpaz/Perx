import { createClient } from '@/utils/supabase/server';
import ChangePasswordButton from '@/components/merchant/MerchantChangePasswordLink';

export default async function ChangePassLink() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // useEffect(() => {
  //   const fetchUserEmail = async () => {
  //     const supabase = await createClient();
  //     const { data, error } = await supabase.auth.getUser();
  //     if (data?.user) {
  //       setEmail(data.user.email ?? null);
  //     }
  //   };

  //   fetchUserEmail();
  // }, []);

  // const handleSendLink = async () => {
  //   if (!email) return;

  //   setIsLoading(true);

  //   try {
  //     // Replace this with your actual function to send the recovery link
  //     await sendRecoveryLink(email);
  //     alert('Recovery link sent to your email.');
  //     router.push('/merchant/settings');
  //   } catch (error) {
  //     console.error('Error sending recovery link:', error);
  //     alert('Failed to send recovery link.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col justify-center rounded-md bg-white p-6 shadow-md">
        <h1 className="text-center text-lg font-semibold">
          Are you sure you want to change your password? We will send a link to
          your email that will redirect you to change your password.
        </h1>
        <ChangePasswordButton />
      </div>
    </div>
  );
}

// Replace this with your actual function to send the recovery link
async function sendRecoveryLink(email: string) {
  // Simulate sending the recovery link
  return new Promise((resolve) => setTimeout(resolve, 2000));
}
