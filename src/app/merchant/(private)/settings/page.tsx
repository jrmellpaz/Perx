import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Mail, Lock, Share2, Palette, HelpCircle, FileText, LogOut } from "lucide-react";
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen text-neutral-800">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-neutral-200">
        <Link href="/merchant/profile">
          <ArrowLeft className="h-5 w-5" size={35}/>
        </Link>
        {/* <div className=""></div> Spacer */}
        <h1 className="flex-1 text-xl font-sans ml-2">Settings</h1>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto py-8 px-4 space-y-8">

        {/* Account Section */}
        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Account</h2>
          <div className="divide-y divide-neutral-200 bg-white rounded-md shadow-sm">
            <div className="flex items-center justify-between py-4 px-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-neutral-500" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-neutral-500">ipsum@example.com</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <Lock className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Change Password</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <Share2 className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Share Account</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Display Section */}
        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Display</h2>
          <div className="divide-y divide-neutral-200 bg-white rounded-md shadow-sm">
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
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
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Support & About</h2>
          <div className="divide-y divide-neutral-200 bg-white rounded-md shadow-sm">
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Report a Problem</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Support</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Policies</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Login</h2>
          <div className="bg-white rounded-md shadow-sm">
            <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-neutral-100">
              <div className="flex items-center gap-4">
                <LogOut className="h-5 w-5 text-neutral-500" />
                <span className="text-sm">Log Out Account</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
