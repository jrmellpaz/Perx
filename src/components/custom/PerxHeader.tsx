import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function PerxHeader({
  link,
  title,
}: {
  link: string;
  title: string;
}) {
  return (
    <header className="flex w-full items-center gap-2">
      <Link href={link}>
        <Button variant={'ghost'} className="aspect-square rounded-full p-2">
          <ArrowLeftIcon size={36} />
        </Button>
      </Link>
      <h1>{title}</h1>
    </header>
  );
}
