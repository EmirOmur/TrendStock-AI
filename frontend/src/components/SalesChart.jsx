import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SalesChart({ data, title = 'Sales Trend (14 Days)' }) {
  // Empty state when no product selected
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4
                      flex flex-col items-center justify-center h-48 gap-2">
        <span className="text-3xl opacity-20">📊</span>
        <p className="text-xs text-slate-600">Select a product to view sales chart</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        📊 {title}
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '11px',
            }}
            itemStyle={{ color: '#22d3ee' }}
            labelStyle={{ color: '#64748b' }}
            cursor={{ stroke: '#334155', strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 2, fill: '#22d3ee', strokeWidth: 0 }}
            activeDot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
