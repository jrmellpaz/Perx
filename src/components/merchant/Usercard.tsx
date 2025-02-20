import { LucideIcon } from 'lucide-react';

interface UserCardProps {
  title: string;
  amount: string;
  icon?: LucideIcon;
  amtIcon?: LucideIcon;
}

const UserCard = ({
  title,
  amount,
  icon: Icon,
  amtIcon: AmtIcon,
}: UserCardProps) => {
  return (
    <div className="bg-perx-crimson min-w-[130px] flex-1 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px]">{title}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex items-center">
        {AmtIcon && <AmtIcon size={20} className="mr-2" />}
        <h1 className="my-4 text-2xl font-semibold">{amount}</h1>
      </div>
      {/* <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2> */}
    </div>
  );
};

export default UserCard;
