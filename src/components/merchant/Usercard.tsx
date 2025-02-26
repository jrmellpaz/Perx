import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface UserCardProps {
  title: string;
  amount: string;
  icon?: LucideIcon;
  amtIcon?: LucideIcon;
  titleClassName?: string;
  amtClassName?: string;
  amtIconSize?: number;
  bgColor?: string;
  color?: string;
}

const UserCard = ({
  title,
  amount,
  icon: Icon,
  amtIcon: AmtIcon,
  titleClassName,
  amtClassName,
  amtIconSize=20,
  bgColor,
  color,
  
}: UserCardProps) => {
  return (
    <div className={`${bgColor} min-w-[130px] flex-1 rounded-2xl p-4}`}>
      <div className="flex items-center justify-between">
        <span className={`${titleClassName}`}>{title}</span>
        <Link href="/merchant/monthly-records">
        {Icon && <Icon size={30} style={{color}} className="mr-2 hover:bg-perx-canopy rounded-full p-1"/>}
        </Link>
      </div>
      <div className="flex items-center">
        {AmtIcon && <AmtIcon size={amtIconSize} style={{color}} className="mx-3" />}
        <h1 className={`${amtClassName}`}>{amount}</h1>
      </div>
    </div>
  );
};

export default UserCard;
