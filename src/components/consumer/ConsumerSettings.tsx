'use client';

import { logoutConsumer, updatePassword } from '@/actions/consumerAuth';
import {
  ChevronRight,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  Share2,
  Sparkles,
  Tickets,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { deleteAccount } from '@/actions/consumerProfile';

import type { User } from '@supabase/supabase-js';

export function AccountSection({ user }: { user: User }) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-medium">
        Account
      </h2>
      <div className="divide-border divide-y rounded-md bg-white">
        <div className="flex items-center gap-4 p-4">
          <Mail className="text-muted-foreground h-5 w-5" />
          <div>
            <div className="text-sm font-medium">Email</div>
            <div className="text-muted-foreground font-mono text-xs">
              {user.email}
            </div>
          </div>
        </div>
        <ChangePassword />
        <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-50">
          <div className="flex items-center gap-4">
            <Share2 className="text-muted-foreground h-5 w-5" />
            <span className="text-sm">Share account</span>
          </div>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </div>
        <DeleteAccount userId={user.id} />
      </div>
    </div>
  );
}

export function LoginSection() {
  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-medium">
        Log Out
      </h2>
      <div className="w-full rounded-md bg-white">
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dialogRef.current?.showModal();
      await logoutConsumer();
      toast.success('Logged out successfully.');
      router.push('/explore');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dialogRef.current?.close();
    }
  };

  return (
    <>
      <button
        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-50"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-4">
          <LogOut className="text-muted-foreground h-5 w-5" />
          <span className="text-sm">Log out account</span>
        </div>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </button>
      <dialog
        ref={dialogRef}
        className="bg-perx-white fixed inset-0 m-auto w-9/10 rounded-lg p-8 shadow-lg transition-all duration-300 sm:max-w-[600px]"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderCircle
            className="text-perx-blue animate-spin"
            size={32}
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-muted-foreground text-sm">Logging out...</p>
        </div>
      </dialog>
    </>
  );
}

function ChangePassword() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = () => {
    setIsDialogOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      dialogRef.current?.close();
    }, 300);
  };

  const handleSendRedirectLink = async () => {
    setIsLoading(true);

    try {
      await updatePassword();
      toast.success('Redirect link successfully sent to your email.');
    } catch (error) {
      throw new Error('Error sending redirect link');
    } finally {
      setIsLoading(false);
      closeDialog();
    }
  };

  return (
    <>
      <button
        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-50"
        onClick={openDialog}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex gap-4">
            <Lock className="text-muted-foreground" />
            <span className="text-sm">Change password</span>
          </div>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </div>
      </button>

      <dialog
        ref={dialogRef}
        className={`bg-perx-white fixed inset-0 m-auto w-9/10 rounded-lg p-8 shadow-lg transition-all duration-300 sm:max-w-[600px] ${
          isDialogOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-mono text-lg font-medium">
            Change password
          </h3>
          <p className="text-muted-foreground text-sm">
            A redirect link will be sent to your email.
          </p>
        </div>
        <div className="mt-12 flex justify-end gap-2">
          <Button
            variant={'secondary'}
            className="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleSendRedirectLink}
            className="transition-all"
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  className="-ms-1 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Send redirect link
              </>
            ) : (
              'Send redirect link'
            )}
          </Button>
        </div>
      </dialog>
    </>
  );
}

function DeleteAccount({ userId }: { userId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const openDialog = () => {
    setIsDialogOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      dialogRef.current?.close();
    }, 300); // Match the animation duration
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      await deleteAccount(userId);
      toast.success('Account deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
      throw new Error('Error deleting account');
    } finally {
      setIsLoading(false);
      closeDialog();
      toast('Redirecting...');
      router.push('/explore');
    }
  };

  return (
    <div>
      <button
        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 hover:bg-red-50"
        onClick={openDialog}
      >
        <div className="flex items-center gap-4">
          <Trash2 className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-500">
            Delete account permanently
          </span>
        </div>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </button>

      <dialog
        ref={dialogRef}
        className={`bg-perx-white fixed inset-0 m-auto max-h-[80dvh] w-9/10 rounded-lg p-8 shadow-lg transition-all duration-300 sm:max-w-[600px] ${
          isDialogOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="flex h-full flex-col gap-2">
          <h3 className="mb-2 font-mono text-lg font-medium">
            Delete account permanently
          </h3>
          {/* Content Area with Scrollbar */}
          <div className="flex h-full max-h-[50vh] flex-col gap-4 overflow-y-auto">
            <p className="text-muted-foreground text-sm">
              If you delete your account, you will lose the following services
              permanently:
            </p>
            <div className="flex flex-col gap-0.5 px-4">
              <div className="flex items-center gap-2">
                <Tickets size={18} />
                <span className="font-mono font-medium">Purchased coupons</span>
              </div>
              <p className="text-muted-foreground pl-7 text-sm">
                Redeem your coupons before deleting your account.
              </p>
            </div>
            <div className="flex flex-col gap-0.5 px-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <span className="font-mono font-medium">
                  Loyalty Rewards points
                </span>
              </div>
              <p className="text-muted-foreground pl-7 text-sm">
                You will lose all the progress of your Loyalty Rewards points.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-end gap-2">
          <Button
            variant={'secondary'}
            className="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleDeleteAccount}
            className="rounded-md bg-red-700 px-4 py-2 text-sm text-white transition-all hover:bg-red-800"
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  className="-ms-1 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Deleting...
              </>
            ) : (
              'Delete account'
            )}
          </Button>
        </div>
      </dialog>
    </div>
  );
}
