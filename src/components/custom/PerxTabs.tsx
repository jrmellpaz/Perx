import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JSX } from 'react';

interface TabItems {
  icon: JSX.Element;
  name: string;
  content?: JSX.Element;
}

export default function PerxTabs({
  tabItems,
}: {
  tabItems: TabItems[];
  content?: JSX.Element;
}) {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto w-full gap-8 rounded-none border-b bg-transparent px-0 py-2">
          {tabItems.map((item, index) => {
            return (
              <TabsTrigger
                value={`tab-${index + 1}`}
                key={index}
                className="hover:bg-perx-crimson/10 data-[state=active]:hover:bg-perx-crimson/10 hover:text-foreground data-[state=active]:after:bg-perx-crimson data-[state=active]:text-perx-crimson relative flex cursor-pointer items-center justify-center gap-2 px-8 py-2 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.75 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {item.icon}
                <span className="hidden text-base sm:block">{item.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {tabItems.map((item, index) => {
        return (
          <TabsContent
            value={`tab-${index + 1}`}
            key={index}
            className="data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
          >
            {item.content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
