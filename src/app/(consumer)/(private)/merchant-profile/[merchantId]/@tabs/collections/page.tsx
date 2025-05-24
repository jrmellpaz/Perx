import { Blocks } from 'lucide-react';

// app/merchant/profile/@tabs/collections/page.tsx
export default function CollectionsTab() {
  return (
    <div className="flex size-full flex-col items-center-safe justify-center-safe gap-4 p-12">
      <Blocks size={120} className="text-neutral-400" />
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-mono text-2xl font-bold">Coming soon</h1>
        <p className="text-mono text-sm text-neutral-500">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
  );
}
