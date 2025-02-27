'use client';

import { Pencil, Settings, Copy } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';
import { fetchConsumerProfile } from '@/actions/consumer/consumer';
import PerxLoading from '@/components/custom/PerxLoading';

interface UserProfile {
  name: string;
  level: string;
  points: number;
  referralCode: string;
}

export default function ProfilePage() {
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
    return <PerxLoading />;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  // const points = 165;
  const progress = 85;
  // const referralCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="max-y-full mx-auto w-full max-w-full p-2">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold">{profile.name}</h2>
        <div className="flex gap-1">
          <Pencil size={16} className="text-gray-600" />
          <Settings size={16} className="text-gray-600" />
        </div>
      </header>

      <div className="rounded-lg bg-gray-100 p-3 text-center">
        <div className="text-xs font-semibold">DIAMOND I - Level 5</div>
        <div className="relative mx-auto my-1 h-16 w-16">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="fill-transparent stroke-gray-300 stroke-2"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="fill-transparent stroke-purple-600 stroke-4"
              cx="50"
              cy="50"
              r="45"
              strokeDasharray={`${progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs">
            {progress}%
          </div>
        </div>
        <div className="mt-1 text-sm font-semibold">{profile.points} pts</div>
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-xs font-medium">Referral Code</label>
        <div className="flex items-center rounded-lg bg-gray-100 p-2">
          <input
            type="text"
            value={profile.referralCode}
            readOnly
            className="flex-grow border-none bg-transparent text-xs outline-none"
          />
          <button className="p-1 text-gray-600">
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
