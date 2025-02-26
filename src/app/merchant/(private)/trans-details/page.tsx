"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clipboard, Copy } from "lucide-react";

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
  const title = searchParams.get("title");
  const amount = searchParams.get("amount");
  const date = searchParams.get("date");

  if (!title || !amount || !date) {
    return <p className="text-center p-4 text-red-500">Transaction not found</p>;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* <div> */}
        <button onClick={() => router.back()} className="absolute top-1 left-1 flex items-center cursor-pointer">
          <ArrowLeft size={35} className="hover:bg-perx-orchid/20 rounded-full p-2"/> <h1 className="mx-1 text-xl font-sans">Transaction details</h1>
        </button>
      {/* </div> */}

      <div className="w-full max-w-md p-6 mt-12">
        <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
          <div className="w-12 h-12 bg-gray-400"></div>
        </div>

        <h2 className="text-xl font-mono font-semibold mt-4">{title}</h2>
        <span className="px-3 py-1 border-2 border-perx-crimson/20 text-xs rounded-md">Type</span>

        <div className="mt-4 text-sm">
          <div className="flex justify-between border-b py-2">
            <span className="text-perx-black">Transaction number</span>
            <span className="text-perx-black italic ml-30">9023274475630</span>
            <Copy className="w-4 h-4 hover:bg-perx-crimson/20 hover:rounded cursor-pointer" />
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
