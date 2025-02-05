import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <LoaderCircle
      className="text-perx-red -ms-1 me-2 animate-spin"
      size={16}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}
