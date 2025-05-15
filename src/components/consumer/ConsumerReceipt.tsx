'use client';

import { useState } from 'react';

export default function ReceiptUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('user_id', userId);

    const res = await fetch('/api/receipt', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text(); // helpful for debugging
      throw new Error(`Upload failed: ${res.status}\n${text}`);
    }

    const data = await res.json(); // safe now

    if (data.success) {
      setMessage(`✅ Points granted: ${data.points}`);
    } else {
      setMessage(`❌ ${data.error || data.reason}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-2">Upload Receipt</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Submit
      </button>
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
