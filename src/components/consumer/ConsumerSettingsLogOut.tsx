'use client';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight } from 'lucide-react';
import { logoutConsumer } from '@/actions/consumerAuth';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutConsumer();
      toast('Logged out successfully.');
      router.push('/home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-neutral-500">Log Out</h2>
      <div className="rounded-md bg-white shadow-sm">
        <div
          className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-4">
            <LogOut className="h-5 w-5 text-neutral-500" />
            <span className="text-sm">Log Out Account</span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
