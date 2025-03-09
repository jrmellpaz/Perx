import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JSX } from 'react';

interface TabItems {
  icon: JSX.Element;
  name: string;
}

export default function PerxTabs({ tabItems }: { tabItems: TabItems[] }) {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto w-full gap-8 rounded-none border-b bg-transparent px-0 py-1">
          {tabItems.map((item, index) => {
            return (
              <TabsTrigger
                value={`tab-${index + 1}`}
                key={index}
                className="hover:bg-perx-crimson/10 data-[state=active]:hover:bg-perx-crimson/10 hover:text-foreground data-[state=active]:after:bg-perx-crimson data-[state=active]:text-perx-crimson relative flex cursor-pointer items-center justify-center gap-2 px-8 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.75 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {item.icon}
                <span className="hidden sm:block">{item.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 4
        </p>
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 5
        </p>
      </TabsContent>
      <TabsContent value="tab-6">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 6
        </p>
      </TabsContent>
    </Tabs>
  );
}
