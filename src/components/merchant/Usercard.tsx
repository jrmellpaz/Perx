import { LucideIcon } from 'lucide-react';

interface UserCardProps {
  title: string;
  amount: string;
  icon?: LucideIcon;
  amtIcon?: LucideIcon;
  titleClassName?: string;
  amtClassName?: string;
  amtIconSize?: number;
}

const UserCard = ({
  title,
  amount,
  icon: Icon,
  amtIcon: AmtIcon,
  titleClassName,
  amtClassName,
  amtIconSize=20,
  
}: UserCardProps) => {
  return (
    <div className="bg-perx-crimson/15 min-w-[130px] flex-1 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className={`${titleClassName}`}>{title}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex items-center">
        {AmtIcon && <AmtIcon size={amtIconSize} className="mr-2" />}
        <h1 className={`${amtClassName}`}>{amount}</h1>
      </div>
    </div>
  );
};

export default UserCard;
