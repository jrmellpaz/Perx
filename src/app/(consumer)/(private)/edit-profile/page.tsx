'use client';

import { useState, useEffect } from 'react';
import { fetchConsumerProfile, UserProfile, updateConsumerProfile } from '@/actions/consumer/consumer';
import PerxInput from '@/components/custom/PerxInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchConsumerProfile();
      if (data) {
        setProfile(data);
        setName(data.name);
        setOriginalName(data.name);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async () => {
    if (name === originalName) return;
    setLoading(true);
  
    const success = await updateConsumerProfile(name);
    if (success) {
      setOriginalName(name);
    }
  
    setLoading(false);
  };

  const cancelChanges = () => setName(originalName);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <PerxInput 
        label="Name" 
        type="text" 
        placeholder={profile?.name || ""} 
        value={name} 
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        <Link href="/profile">
          <Button onClick={updateProfile} disabled={loading || name === originalName}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="outline" onClick={cancelChanges} disabled={loading}>
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
