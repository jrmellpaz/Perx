import { LucideIcon } from 'lucide-react';

interface UserCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor?: string;
  bgColor2?: string;
  valueText?: string;
  subText?: string;
}

const UserCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  bgColor2,
  valueText = 'text-perx-white font-semibold text-3xl font-mono',
  subText = 'text-perx-white text-sm font-sans',
}: UserCardProps) => {
  return (
    <div
      className={`${bgColor} flex h-20 rounded-2xl p-4 md:w-1/3`}
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
};

export default UserCard;

// interface UserCardProps {
//   title: string;
//   amount: string;
//   icon?: LucideIcon;
//   amtIcon?: LucideIcon;
//   titleClassName?: string;
//   amtClassName?: string;
//   amtIconSize?: number;
//   bgColor?: string;
//   color?: string;
//   textColor?: string;
// }

// const UserCard = ({
//   title,
//   amount,
//   icon: Icon,
//   amtIcon: AmtIcon,
//   titleClassName,
//   amtClassName,
//   amtIconSize = 20,
//   bgColor,
//   color,
//   textColor,
// }: UserCardProps) => {
//   return (
//     <div className={`${bgColor} min-w-[130px] flex-1 rounded-2xl p-4`}>
//       <div className="flex items-center justify-between">
//         <span className={`${titleClassName} ${textColor}`}>{title}</span>
//         <Link href="/merchant/monthly-records">
//           {Icon && (
//             <Icon
//               size={30}
//               style={{ color }}
//               className="hover:bg-perx-canopy mr-2 rounded-full p-1"
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex items-center">
//         {AmtIcon && (
//           <AmtIcon size={amtIconSize} style={{ color }} className="mx-3" />
//         )}
//         <h1 className={`${amtClassName}`}>{amount}</h1>
//       </div>
//     </div>
//   );
// };

// export default UserCard;
