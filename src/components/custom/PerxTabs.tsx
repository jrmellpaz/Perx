'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CSSProperties, JSX } from 'react';
import { cn } from '@/lib/utils';

interface TabItems {
  icon: JSX.Element;
  name: string;
  path: string;
}

export default function PerxTabs({
  tabItems,
  style,
}: {
  tabItems: TabItems[];
  style?: CSSProperties;
}) {
  const pathname = usePathname();

  return (
    <Tabs defaultValue="tab-1" className="m-0 w-full p-0">
      <ScrollArea>
        <TabsList
          className="h-auto w-full gap-8 rounded-none border-b bg-transparent px-0 py-2 shadow-none"
          style={style}
        >
          {tabItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link href={item.path} key={index}>
                <TabsTrigger
                  value={`tab-${index + 1}`}
                  className={cn(
                    'hover:bg-perx-crimson/5 relative flex h-10 cursor-pointer items-center justify-center gap-2 border-0 px-8 py-2 shadow-none transition-all',
                    isActive
                      ? 'text-perx-crimson after:bg-perx-crimson after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  <span className="hidden sm:block">{item.name}</span>
                </TabsTrigger>
              </Link>
            );
          })}
        </TabsList>
      </ScrollArea>
    </Tabs>
  );
}
