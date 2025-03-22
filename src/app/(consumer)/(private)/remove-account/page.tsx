'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { deleteAccount } from '@/actions/consumer/profile';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PerxAlert from '@/components/custom/PerxAlert'; 
import { toast } from 'sonner';

export default function DeleteAccountPage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          setError("Failed to fetch user. Please try again.");
          return;
        }
        if (user) {
          setUserId(user.id);
        } else {
          setError("No user found.");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    fetchUser();
  }, [supabase]);

  const handleDelete = async () => {
    if (!isChecked) {
      setError("Please check the confirmation box before proceeding.");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      await deleteAccount(userId!);
      toast("Account is deleted successfully.");
      router.push("/home"); // Redirect after deletion
    } catch (error) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-800">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-neutral-200">
        <Link href="/settings">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-xl font-sans ml-2">Delete account permanently</h1>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
        <p className="text-sm text-neutral-600">
          If you delete your account, you will lose the following services permanently:
        </p>

        <div className="space-y-2">
          <h2 className="text-md font-semibold">📜 Purchased Coupons</h2>
          <p className="text-sm text-neutral-500">
            Redeem your coupons before deleting your account.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-md font-semibold">🎖 Loyalty Reward Points</h2>
          <p className="text-sm text-neutral-500">
            You will lose all your loyalty points.
          </p>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-red-600"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <span className="text-sm text-neutral-700">
            I understand that I will lose all services after deletion.
          </span>
        </label>

        {/* Show alert if there's an error */}
        {error && <PerxAlert heading={error} message="" variant="error" />}

        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete account permanently"}
        </Button>
      </div>
    </div>
  );
}