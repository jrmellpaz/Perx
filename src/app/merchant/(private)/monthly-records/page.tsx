"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, CircleArrowRight, StepForward } from 'lucide-react';
import { useState } from 'react';



const recordsData: Record<string, { date: string; title: string; amount: string }[]> = {
  "January 2025": [
    { date: "3 Jan 2025 - 12:55 PM", title: "Coupon 72", amount: "₱350.75" },
    { date: "3 Jan 2025 - 12:52 PM", title: "Coupon 69", amount: "₱350.75" },
    { date: "3 Jan 2025 - 12:13 PM", title: "Coupon 35", amount: "₱350.75" },
    { date: "3 Jan 2025 - 10:38 AM", title: "Coupon 47", amount: "₱350.75" },
  ],
  "February 2025": [
    { date: "5 Feb 2025 - 1:10 PM", title: "Coupon 15", amount: "₱500.00" },
    { date: "4 Feb 2025 - 11:30 AM", title: "Coupon 28", amount: "₱350.75" },
  ],
  "March 2025": [
    { date: "2 Mar 2025 - 9:45 AM", title: "Coupon 100", amount: "₱250.50" },
  ],
  "April 2025": [

  ],
  "May 2025": [
    
  ],
  "June 2025": [
    
  ],
  "July 2025": [
    
  ],
  "August 2025": [
    
  ],
  "September 2025": [
    
  ],
  "October 2025": [
    
  ],
  "November 2025": [
    
  ],
  "December 2025": [
    
  ],
};

// List of months for navigation
const months = Object.keys(recordsData);

const MonthlyRecords = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const prevMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1));
  };

  const nextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : 0));
  };

  const currentMonth = months[currentMonthIndex];
  const records = recordsData[currentMonth] || [];

  return (
    <div>
       <div className="flex items-center space-x-2">
         <Link href="/merchant/dashboard">
           <ArrowLeft size={35} className="hover:bg-perx-orchid/20 rounded-full p-2"/>
         </Link>
         <h1 className="text-xl font-sans text-perx-black">Monthly Records</h1>
       </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between px-4 py-2">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-perx-crimson/20">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-medium font-sans">{currentMonth}</span>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-perx-crimson/20">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Record List */}
      <div className="divide-y">
        {records.length > 0 ? (
          records.map((record, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-mono">{record.date}</p>
                <p className="text-sm font-semibold font-mono">{record.title}</p>
                <p className="text-perx-canopy font-medium font-mono">{record.amount}</p>
              </div>
              <Link href={`/merchant/trans-details?date=${encodeURIComponent(record.date)}&title=${encodeURIComponent(record.title)}&amount=${encodeURIComponent(record.amount)}`}>
                <CircleArrowRight size={28} className="text-gray-400 hover:bg-perx-crimson/20 rounded-full p-1" />
              </Link>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No records for this month.</p>
        )}
      </div>
    </div>
  );
};


export default MonthlyRecords;
