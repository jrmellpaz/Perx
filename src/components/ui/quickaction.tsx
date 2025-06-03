import { LucideIcon } from 'lucide-react';
import { Content } from 'next/font/google';
import Link from 'next/link';

interface quickActProps {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor?: string;
  bgColor2?: string;
  valueText?: string;
  subText?: string;
  link?: string;
}

const QuickAct = ({
  title,
  value,
  icon: Icon,
  bgColor,
  bgColor2,
  valueText = 'text-perx-white font-semibold text-l font-mono',
  subText = 'text-perx-white text-sm font-sans',
  link = '',
}: quickActProps) => {
  const content = (
    <div
      className={`${bgColor} flex h-20 rounded-2xl p-4`}
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <div
        className={`${bgColor2} flex w-12 items-center justify-center rounded-2xl`}
      >
        {Icon && <Icon style={{ color: 'white' }} />}
      </div>
      <div className="horizontal ml-2 flex flex-col justify-center">
        <span className={`${valueText}`}>{value}</span>
        <span className={`${subText}`}>{title}</span>
      </div>
    </div>
  );
  return link ? (
    <Link href={link} className="block w-full">
      {content}
    </Link>
  ) : (
    content
  );
};

export default QuickAct;
