'use client';

import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'sonner';
import { Input } from '../ui/input';

export default function ReceiptUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a receipt image first.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Scanning your receipt...');

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, 'eng');

      toast.loading('Processing receipt...', {
        id: loadingToast
      });

      const res = await fetch('/api/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, text }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Ka-ching! 💰 Points added to your wallet!`);
        setSubmitted(true); // ✅ Show upload another prompt
      } else {
        toast.error(data.error || 'Oops! This receipt is being shy. Try another one.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Our receipt scanner had a hiccup. Give it another shot!');
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Upload Receipt</h2>
      {preview && (
        <img
          src={preview}
          alt="Receipt Preview"
          className="object-cover border rounded"
        />
      )}

      {!submitted ? (
        <Input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
      ) : (
        <button
          onClick={() => {
            setFile(null);
            setPreview(null);
            setSubmitted(false);
          }}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded w-full"
        >
          Upload Another Receipt
        </button>
      )}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || submitted}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
}
