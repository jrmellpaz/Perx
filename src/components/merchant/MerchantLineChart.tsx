'use client';
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

const data = [
  {
    name: 'Jan',
    2026: 4000,
    2025: 2400,
  },
  {
    name: 'Feb',
    2026: 3000,
    2025: 1398,
  },
  {
    name: 'Mar',
    2026: 2000,
    2025: 9800,
  },
  {
    name: 'Apr',
    2026: 2780,
    2025: 3908,
  },
  {
    name: 'May',
    2026: 1890,
    2025: 4800,
  },
  {
    name: 'Jun',
    2026: 2390,
    2025: 3800,
  },
  {
    name: 'Jul',
    2026: 3490,
    2025: 4300,
  },
  {
    name: 'Aug',
    2026: 5000,
    2025: 4300,
  },
  {
    name: 'Sept',
    2026: 4500,
    2025: 4300,
  },
  {
    name: 'Oct',
    2026: 3000,
    2025: 4300,
  },
  {
    name: 'Nov',
    2026: 2000,
    2025: 4300,
  },
  {
    name: 'Dec',
    2026: 2500,
    2025: 4300,
  },
];

const MerchantLineChart = () => {
  return (
    <div
      className="bg-perx-gray h-full w-full rounded-xl p-4"
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-mono-bold text-perx-black mx-1 text-lg font-semibold">
          Total Sales
        </h1>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          // width={500}
          // height={300}
          data={data}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="0" stroke="gray" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: '#1E1919' }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#1E1919' }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: '10px' }}
            className="perx-"
          />
          <Line
            type="monotone"
            dataKey="2025"
            stroke="#9B0032"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="2026"
            stroke="#B4C8E1"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MerchantLineChart;
