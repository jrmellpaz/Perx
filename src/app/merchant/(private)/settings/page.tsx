import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  ArrowLeft,
  Mail,
  Lock,
  Share2,
  Palette,
  HelpCircle,
  FileText,
  LogOut,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import PerxHeader from '@/components/custom/PerxHeader';
import LogoutButton from '@/components/merchant/MerchantSettingsLogOut';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen text-neutral-800">
      {/* Header */}
      {/* <div className=""></div> Spacer */}
      <PerxHeader title="Settings" link="/profile" />

      {/* Content */}
      <div className="mx-auto max-w-xl space-y-8 px-4 py-8">
        {/* Account Section */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-neutral-500">Account</h2>
          <div className="divide-y divide-neutral-200 rounded-md bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-neutral-500" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-neutral-500">
                    {data?.user?.email}
                  </div>
                </div>
              </div>
            </div>
            <Link href="/change-pass-link">
              <div className="flex cursor-pointer items-center justify-between border-b-1 px-4 py-4 hover:bg-neutral-100">
                <div className="flex items-center gap-4">
                  <Lock className="h-5 w-5 text-neutral-500" />
                  <span className="text-sm">Change Password</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
            <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <Share2 className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Share Account</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <Link href="/remove-account">
              <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
                <div className="flex items-center gap-4">
                  <Trash2 className="h-5 w-5 text-neutral-500" />
                  <span className="text-sm">Delete account permanently</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* Display Section */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-neutral-500">Display</h2>
          <div className="divide-y divide-neutral-200 rounded-md bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <Palette className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Theme</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Support & About Section */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-neutral-500">
            Support & About
          </h2>
          <div className="divide-y divide-neutral-200 rounded-md bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Report a Problem</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Support</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Policies</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Login Section */}
        <LogoutButton />
      </div>
    </div>
  );
}
