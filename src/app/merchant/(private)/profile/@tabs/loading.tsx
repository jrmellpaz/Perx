import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-28 w-full items-end justify-center">
      <LoaderCircle
        className="text-perx-blue -ms-1 me-2 animate-spin"
        size={32}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
}
