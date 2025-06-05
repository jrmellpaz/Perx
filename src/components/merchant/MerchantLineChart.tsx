'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
// Adjust the import path according to your project structure
import {
  fetchRevenueForYearByMonth,
  MonthlyRevenueData,
} from '@/actions/dashboard';

type MerchantLineChartProps = {
  data: number;
};

const MerchantLineChart = ({ data }: MerchantLineChartProps) => {
  const currentYear = new Date().getFullYear(); // You can make this selectable

  // Initialize state with the correct structure, including the dynamic year key
  const initialDataForYear: MonthlyRevenueData[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ].map((monthName) => ({ name: monthName, [currentYear]: 0 }));

  const [chartData, setChartData] =
    useState<MonthlyRevenueData[]>(initialDataForYear);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRevenueData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRevenueForYearByMonth(currentYear);
        if (data && data.length > 0) {
          // Ensure data has the dynamic year key correctly
          const formattedData = data.map((d: Record<string, any>) => ({
            name: d.name,
            [currentYear]:
              d[currentYear] !== undefined
                ? d[currentYear]
                : d[String(currentYear)] !== undefined
                  ? d[String(currentYear)]
                  : 0,
          }));
          setChartData(formattedData);
        } else {
          // If no data or empty data, fallback to initialized zeroed data
          setChartData(initialDataForYear);
        }
      } catch (e) {
        console.error('Failed to fetch monthly revenue:', e);
        const errorMessage =
          e instanceof Error ? e.message : 'An unknown error occurred';
        setError(`Failed to load sales data. ${errorMessage}`);
        setChartData(initialDataForYear); // Fallback to zeroed data on error
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, [currentYear]); // Re-fetch if the year changes

  if (isLoading) {
    return (
      <div className="bg-perx-gray flex h-full w-full items-center justify-center rounded-xl p-4">
        <p className="text-perx-black">
          Loading sales data for {currentYear}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-perx-gray flex h-full w-full items-center justify-center rounded-xl p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-perx-black/3 h-full w-full rounded-xl p-3"
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-mono-bold text-perx-black mx-1 text-lg font-semibold">
          Monthly Sales
        </h1>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#bdbdbd" />{' '}
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: '#1E1919', fontSize: 12 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#1E1919', fontSize: 12 }}
            tickLine={false}
            tickMargin={10} // Adjusted margin
            tickFormatter={(value) =>
              value.toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP',
                maximumFractionDigits: 0,
              })
            } // Format Y-axis ticks
          />
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              value.toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP',
                maximumFractionDigits: 0,
              }),
              `Revenue in ${props.payload.name} ${currentYear}`,
            ]}
            labelStyle={{ color: '#1E1919', fontWeight: '800' }}
            itemStyle={{ color: '#9B0032' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: '20px' }} // Ensure legend doesn't overlap chart title
          />
          <Line
            type="monotone"
            dataKey={String(currentYear)} // Ensure this matches the key in your data (e.g., "2025")
            stroke="#9B0032"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#9B0032' }} // Style points
            activeDot={{ r: 6, strokeWidth: 2, fill: '#9B0032' }}
            name={`${currentYear}`} // Name for the legend
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MerchantLineChart;
