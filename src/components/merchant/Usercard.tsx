import { LucideIcon } from 'lucide-react';


interface UserCardProps {
  title: string;
  amount: string;
  icon?: LucideIcon;
  amtIcon?: LucideIcon;
}

const UserCard = ({title, amount, icon: Icon, amtIcon: AmtIcon}:UserCardProps) => {
  return(
    <div className='rounded-2xl bg-perx-crimson p-4 flex-1 min-w-[130px]'>
      <div className="flex justify-between items-center">
        <span className="text-[10px]">{title}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex items-center">
        {AmtIcon && <AmtIcon size={20} className="mr-2"/>}
        <h1 className="text-2xl font-semibold my-4">{amount}</h1>
      </div>
      {/* <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2> */}
    </div>
  );
}

export default UserCard