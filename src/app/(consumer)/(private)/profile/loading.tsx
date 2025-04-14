import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center text-red-900">
      <LoaderCircle
        className="text-perx-blue -ms-1 me-2 animate-spin"
        size={40}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
}
