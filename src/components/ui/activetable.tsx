'use client';

import React, { useEffect, useState } from 'react';

interface CouponTableProps {
  coupons: {
    id: string;
    title: string;
    category: string;
    valid_to: string | null;
    quantity: number;
  }[];
}

const ActiveCouponsTable: React.FC<CouponTableProps> = ({ coupons }) => {
  return (
    <div
      className="hide-scrollbar w-full overflow-x-auto overflow-y-auto rounded-lg sm:max-h-[200px]"
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <table className="w-full min-w-[500px] border-collapse">
        <thead
          className="sticky top-0"
          style={{ backgroundColor: 'var(--color-perx-navy)' }}
        >
          <tr>
            <th className="text-perx-white p-2 font-sans text-sm">
              Active Coupons
            </th>
            <th className="text-perx-white p-2 font-sans text-sm">Category</th>
            <th className="text-perx-white p-2 font-sans text-sm">
              Valid until
            </th>
            <th className="text-perx-white p-2 font-sans text-sm">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, idx) => (
            <tr
              key={coupon.id + idx}
              className="hover:bg-[color-mix(in_srgb,var(--color-bg-perx-cloud)_15%, transparent]"
              style={{
                backgroundColor:
                  idx % 2 == 0
                    ? 'var(--color-perx-white)'
                    : 'color-mix(in srgb, var(--color-perx-cloud) 30%, transparent)',
              }}
            >
              <td className="p-3 font-sans text-sm">{coupon.title}</td>
              <td className="p-3 font-sans text-sm">{coupon.category}</td>
              <td className="p-2 text-center font-sans text-sm">
                {coupon.valid_to
                  ? new Date(coupon.valid_to).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="p-3 text-right font-sans text-sm">
                {coupon.quantity}
              </td>
            </tr>
          ))}
          {/* {coupons.length === 0 ? (
            <tr>
              <td colSpan={4} className="">
                No active coupons found.
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.title}</td>
                <td>{coupon.category}</td>
                <td>
                  {coupon.valid_to
                    ? new Date(coupon.valid_to).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{coupon.quantity}</td>
              </tr>
            ))
          )} */}
        </tbody>
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
