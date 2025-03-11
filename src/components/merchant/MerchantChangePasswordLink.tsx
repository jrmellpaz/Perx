'use client';

export default function ChangePasswordButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="flex justify-end gap-4">
      <button
        className="bg-perx-crimson rounded-md p-2 text-white"
        onClick={handleSendLink}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Yes, send the link'}
      </button>
    </div>
  );
}
