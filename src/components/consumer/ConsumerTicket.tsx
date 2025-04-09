// 'use client';
// import { ConsumerCoupon } from '@/lib/consumer/couponSchema';
// import Link from 'next/link';

// export default function Ticket({ coupon }: { coupon: ConsumerCoupon }) {
//   return (
//     <div className="relative flex w-[99%] max-w-[800px] flex-col rounded-lg border bg-white shadow-md">
//       {/* Upper Half */}
//       <Link
//         href={{
//           pathname: '/view',
//           query: {
//             coupon: JSON.stringify(coupon),
//             merchantId: coupon.merchant.id,
//           },
//         }}
//         key={id}
//       >
//         <div className="flex flex-col">
//           {image && (
//             <div className="h-40 w-full overflow-hidden rounded-t-lg">
//               <img
//                 src={image}
//                 alt={title}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           )}
//           <div className="p-4">
//             <h2 className="text-lg font-bold text-gray-800">{title}</h2>
//             <div className="flex shrink-0 items-center gap-2">
//               <img
//                 src={merchantLogo}
//                 alt={merchantName}
//                 className="aspect-square h-6 w-6 rounded-full object-cover"
//               />
//               <p className="text-sm text-gray-800">{merchantName}</p>
//             </div>
//             <p className="text-sm text-gray-600">{description}</p>
//           </div>
//         </div>

//         {/* Broken Line Divider */}
//         <div className="relative flex items-center">
//           <div className="w-full border-t border-dashed border-gray-300"></div>
//           <div className="absolute -left-3 size-6 rounded-full border bg-white"></div>
//           <div className="absolute -right-3 size-6 rounded-full border bg-white"></div>
//         </div>

//         {/* Lower Half */}
//         <div className="flex items-center justify-between p-4">
//           <span className="text-perx-crimson text-xl font-semibold">
//             {price}
//           </span>
//           <button className="bg-perx-blue hover:bg-perx-blue/90 rounded-full px-4 py-2 text-sm font-medium text-white">
//             Purchase
//           </button>
//         </div>
//       </Link>
//     </div>
//   );
// }
