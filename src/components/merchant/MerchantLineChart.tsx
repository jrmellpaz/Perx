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
    2026: 3490,
    2025: 4300,
  },
  {
    name: 'Sept',
    2026: 3490,
    2025: 4300,
  },
  {
    name: 'Oct',
    2026: 3490,
    2025: 4300,
  },
  {
    name: 'Nov',
    2026: 3490,
    2025: 4300,
  },
  {
    name: 'Dec',
    2026: 3490,
    2025: 4300,
  },
];

const MerchantLineChart = () => {
  return (
    <div className="border-perx-crimson h-full w-full rounded-xl border-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-mono-bold text-perx-black mx-1 my-1 text-2xl">
          Sales
        </h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#1E1919" />
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
            wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
            className="perx-"
          />
          <Line
            type="monotone"
            dataKey="2025"
            stroke="#FAD24B"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="2026"
            stroke="#78286E"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MerchantLineChart;
