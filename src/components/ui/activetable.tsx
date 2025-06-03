'use client';

import React, { useEffect, useState } from 'react';

interface ActiveCoupon {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  itemsLeft: number;
}

const ActiveCouponsTable = () => {
  return (
    <div className="h-full w-full bg-amber-100">
      table
      <table className="h-full w-full bg-blue-700">
        <thead></thead>
      </table>
    </div>
  );
};

export default ActiveCouponsTable;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { createClient } from '@/utils/supabase/server';

// interface Coupon {
//   id: string;
//   name: string;
//   category: string;
//   expiryDate: string;
//   itemsLeft: number;
// }

// const ActiveCouponsTable: React.FC = () => {
//   const [coupons, setCoupons] = useState<Coupon[]>([]);

//   useEffect(() => {
//     const fetchCoupons = async () => {
//       const mockData: Coupon[] = [
//         {
//           id: '1',
//           name: 'SUMMER50',
//           category: 'Seasonal',
//           expiryDate: '2025-06-30',
//           itemsLeft: 120,
//         },
//         {
//           id: '2',
//           name: 'WELCOME10',
//           category: 'New Users',
//           expiryDate: '2025-07-15',
//           itemsLeft: 58,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//         {
//           id: '3',
//           name: 'FREESHIP',
//           category: 'Shipping',
//           expiryDate: '2025-06-01',
//           itemsLeft: 300,
//         },
//       ];
//       setCoupons(mockData);
//     };
//     fetchCoupons();
//   }, []);

//   return (
//     <div>
//       <div className="w-full overflow-x-auto overflow-y-auto rounded-lg sm:max-h-[225px]">
//         <table className="w-full min-w-[500px] border-collapse">
//           {/* STEP 1: Customize Table Header */}
//           <thead
//             className="sticky top-0"
//             style={{ backgroundColor: 'var(--color-perx-navy)' }}
//           >
//             <tr>
//               <th className="p-2 font-sans text-sm text-white">
//                 Active Coupons
//               </th>
//               <th className="p-2 font-sans text-sm text-white">Category</th>
//               <th className="p-2 font-sans text-sm text-white">Expiry Date</th>
//               <th className="p-2 font-sans text-sm text-white">Items Left</th>
//             </tr>
//           </thead>

//           {/* STEP 2: Customize Table Body */}
//           <tbody>
//             {coupons.map((coupon, idx) => (
//               <tr
//                 key={coupon.id + idx}
//                 className="hover:bg-[color-mix(in_srgb,var(--color-perx-cloud)_15%,transparent)]"
//                 style={{
//                   backgroundColor:
//                     idx % 2 === 0
//                       ? 'var(--color-perx-white)'
//                       : 'color-mix(in srgb, var(--color-perx-cloud) 35%, transparent)',
//                 }}
//               >
//                 <td className="p-2 font-sans text-sm">{coupon.name}</td>
//                 <td className="p-2 font-sans text-sm">{coupon.category}</td>
//                 <td className="p-2 font-sans text-sm">{coupon.expiryDate}</td>
//                 <td className="p-2 font-sans text-sm">{coupon.itemsLeft}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ActiveCouponsTable;
