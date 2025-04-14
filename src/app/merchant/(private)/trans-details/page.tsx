'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clipboard, Copy } from 'lucide-react';
import PerxHeader from '@/components/custom/PerxHeader';

// Mock transaction data
// const mockTransactions = [
//   {
//     id: "1",
//     title: "Coupon 72",
//     transaction_number: "9023274475630",
//     amount: 350.75,
//     date: "2025-01-03T12:55:00",
//   },
// ];

// const TransactionDetails = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Extract parameters from URL
//   const title = searchParams.get("title");
//   const amount = searchParams.get("amount");
//   const date = searchParams.get("date");

//   const [transaction, setTransaction] = useState<any>(null);

//   useEffect(() => {
//     // Simulate fetching the transaction details
//     const data = mockTransactions.find((t) => t.title === title);
//     setTransaction(data);
//   }, [title]);

//   if (!transaction)
//     return <p className="text-center p-4 text-red-500">Transaction not found</p>;

//   return (
//     <div className="max-w-md mx-auto p-4 bg-[#fff7f5] min-h-screen">
//       {/* Back Button */}
//       <button onClick={() => router.back()} className="mb-4 flex items-center text-gray-600">
//         ← Transaction details
//       </button>

//       {/* Placeholder Image */}
//       <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
//         <div className="w-12 h-12 bg-gray-400"></div>
//       </div>

//       {/* Transaction Details */}
//       <h2 className="text-xl font-semibold mt-4">{title}</h2>
//       <span className="px-3 py-1 bg-gray-200 text-xs rounded-full">Type</span>

//       {/* Info Section */}
//       <div className="mt-4 text-sm">
//         <div className="flex justify-between border-b py-2">
//           <span className="text-gray-500">Transaction number</span>
//           <span className="flex items-center">
//             {transaction?.transaction_number || "N/A"}{" "}
//             <Clipboard className="ml-2 w-4 h-4 text-red-500 cursor-pointer" />
//           </span>
//         </div>
//         <div className="flex justify-between border-b py-2">
//           <span className="text-gray-500">Amount</span>
//           <span className="text-green-600 font-medium">{amount}</span>
//         </div>
//         <div className="flex justify-between border-b py-2">
//           <span className="text-gray-500">Date</span>
//           <span>{date}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

const TransactionDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const title = searchParams.get('title');
  const amount = searchParams.get('amount');
  const date = searchParams.get('date');

  if (!title || !amount || !date) {
    return (
      <p className="p-4 text-center text-red-500">Transaction not found</p>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {/* <div> */}
      <button
        onClick={() => router.back()}
        className="absolute top-1 left-1 flex cursor-pointer items-center"
      >
        <PerxHeader title="Transaction Details" className="bg-white" />
      </button>
      {/* </div> */}

      <div className="mt-12 w-full max-w-md p-6">
        <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-300">
          <div className="h-12 w-12 bg-gray-400"></div>
        </div>

        <h2 className="mt-4 font-mono text-xl font-semibold">{title}</h2>
        <span className="border-perx-crimson/20 rounded-md border-2 px-3 py-1 text-xs">
          Type
        </span>

        <div className="mt-4 text-sm">
          <div className="flex justify-between border-b py-2">
            <span className="text-perx-black">Transaction number</span>
            <span className="text-perx-black ml-30 italic">9023274475630</span>
            <Copy className="hover:bg-perx-crimson/20 h-4 w-4 cursor-pointer hover:rounded" />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-perx-black">Amount</span>
            <span className="text-perx-canopy font-medium">{amount}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-perx-black">Date</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
