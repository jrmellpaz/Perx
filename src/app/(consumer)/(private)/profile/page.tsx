'use client';

import { Pencil, Settings, Copy } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';
import { fetchConsumerProfile } from '@/actions/consumer/consumer';

export default function MerchantTemplate({ children }: { children: React.ReactNode }) {
  return (
    <section className="grow overflow-y-auto bg-white p-4 md:rounded-l-xl md:p-4">
      <ProfilePage />
      {children}
    </section>
  );
}

interface UserProfile {
  name: string;
  level: string;
  points: number;
  referralCode: string;
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const profileData = await fetchConsumerProfile();
      setProfile(profileData);
      setLoading(false);
    };

    getProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  // const points = 165;
  const progress = 85;
  // const referralCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="p-2 w-full max-w-full max-y-full mx-auto">
      <header className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">{profile.name}</h2>
        <div className="flex gap-1">
          <Pencil size={16} className="text-gray-600" />
          <Settings size={16} className="text-gray-600" />
        </div>
      </header>
      
      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <div className="text-xs font-semibold">DIAMOND I - Level 5</div>
        <div className="relative w-16 h-16 mx-auto my-1">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="stroke-gray-300 stroke-2 fill-transparent" cx="50" cy="50" r="45" />
            <circle
              className="stroke-purple-600 stroke-4 fill-transparent"
              cx="50" cy="50" r="45"
              strokeDasharray={`${progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs">{progress}%</div>
        </div>
        <div className="mt-1 text-sm font-semibold">{profile.points} pts</div>
      </div>
      
      <div className="mt-2">
        <label className="text-xs font-medium block mb-1">Referral Code</label>
        <div className="flex items-center bg-gray-100 p-2 rounded-lg">
          <input type="text" value={profile.referralCode} readOnly className="flex-grow bg-transparent border-none outline-none text-xs" />
          <button className="p-1 text-gray-600">
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
