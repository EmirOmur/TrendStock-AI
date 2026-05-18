import { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import SectionCard    from '../components/SectionCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner    from '../components/ErrorBanner.jsx';
import { fetchSalesHistory } from '../api/salesApi.js';
import { fetchAlerts }       from '../api/productApi.js';

const PRODUCT_NAMES = {
  prod_001: 'BeanBliss Espresso Blend',
  prod_002: 'FastCharge Pro USB-C Hub',
  prod_003: 'GlowUp Vitamin C Serum',
  prod_006: 'UrbanEdge Slim Fit Chinos',
  prod_007: 'BrewMaster Cold Brew',
  prod_008: 'ProGamer X1 Mouse',
  prod_011: 'ErgoRise Standing Desk',
  prod_017: 'Morning Ritual Organic Coffee',
};

export default function SalesForecastPage() {
  const [history,   setHistory]   = useState({});
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [selectedId, setSelectedId] = useState('prod_001');

  useEffect(() => {
    Promise.allSettled([fetchSalesHistory(), fetchAlerts()]).then(([histRes, prodRes]) => {
      if (histRes.status === 'fulfilled') {
        // Group by productId
        const grouped = histRes.value.data.data.reduce((acc, rec) => {
          if (!acc[rec.productId]) acc[rec.productId] = [];
          acc[rec.productId].push(rec);
          return acc;
        }, {});
        setHistory(grouped);
      } else {
        setError('Could not load sales history. Make sure the backend is running on port 5000.');
      }
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const chartData    = history[selectedId] ?? [];
  const productInfo  = products.find((p) => p.id === selectedId);
  const trackedIds   = Object.keys(PRODUCT_NAMES);

  // Summary stats
  const stats = useMemo(() => {
    if (!chartData.length) return null;
    const totalActual    = chartData.reduce((s, r) => s + r.unitsSold, 0);
    const totalPredicted = chartData.reduce((s, r) => s + r.predictedUnits, 0);
    const totalRevenue   = chartData.reduce((s, r) => s + r.revenue, 0);
    const latestRisk     = chartData[chartData.length - 1]?.riskScore ?? 0;
    const accuracy       = Math.round(100 - Math.abs(totalActual - totalPredicted) / totalPredicted * 100);
    return { totalActual, totalPredicted, totalRevenue, latestRisk, accuracy };
  }, [chartData]);

  if (loading) return <LoadingSpinner message="Loading sales forecast data…" />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <div className="space-y-5">

      {/* ── Product selector ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {trackedIds.map((id) => {
          const p = products.find((x) => x.id === id);
          const level = p?.riskMetrics?.level;
          return (
            <button
              key={id}
              onClick={() => setSelectedId(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedId === id
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {PRODUCT_NAMES[id].split(' ').slice(0, 2).join(' ')}
              {level && (
                <span className={`ml-1.5 ${
                  level === 'HIGH' ? 'text-red-400' :
                  level === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
                }`}>●</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── KPI row ───────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          {[
            { label: 'Total Units Sold',  value: stats.totalActual,                   color: 'text-slate-200' },
            { label: 'Units Predicted',   value: stats.totalPredicted,                color: 'text-cyan-400'  },
            { label: 'Revenue 14d',       value: `$${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-green-400' },
            { label: 'Forecast Accuracy', value: `${Math.max(0, stats.accuracy)}%`,   color: stats.accuracy >= 90 ? 'text-green-400' : stats.accuracy >= 75 ? 'text-amber-400' : 'text-red-400' },
            { label: 'Current Risk Score',value: `${stats.latestRisk}/100`,            color: stats.latestRisk >= 70 ? 'text-red-400' : stats.latestRisk >= 40 ? 'text-amber-400' : 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <p className="text-xs text-slate-600 mb-0.5">{label}</p>
              <p className={`text-sm font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Main chart ────────────────────────────────────────────── */}
      <SectionCard
        title={`${PRODUCT_NAMES[selectedId]} — 14-Day Sales`}
        description="Actual units sold vs model-predicted units"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 8 }}
              />
              <Line
                type="monotone"
                dataKey="unitsSold"
                name="Actual Sales"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ r: 3, fill: '#22d3ee', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="predictedUnits"
                name="Predicted"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Risk score over time ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Risk Score Trend"
          description="14-day rolling risk score progression"
        >
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'HIGH', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'MEDIUM', fill: '#f59e0b', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Score"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#f87171', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Daily Revenue"
          description="14-day actual revenue per day"
        >
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
                       tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v) => [`$${v.toFixed(0)}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#34d399', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ── Product snapshot ──────────────────────────────────────── */}
      {productInfo && (
        <SectionCard
          title="Product Snapshot"
          description={`${productInfo.category} · ${productInfo.supplierCountry}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { label: 'Price',        value: `$${productInfo.price}` },
              { label: 'Margin',       value: `${productInfo.profitMargin}%` },
              { label: 'Avg Daily',    value: `${productInfo.avgDailySales} units` },
              { label: 'Lead Time',    value: `${productInfo.supplierLeadTimeDays}d` },
              { label: 'Sales 7d',     value: `${productInfo.salesChange7d > 0 ? '+' : ''}${productInfo.salesChange7d}%` },
              { label: 'Trend',        value: `+${productInfo.trendChange}%` },
              { label: 'Competitor',   value: `${productInfo.competitorPriceChange > 0 ? '+' : ''}${productInfo.competitorPriceChange}%` },
              { label: 'Stock Left',   value: `${productInfo.currentStock} units` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-slate-800/60 p-2.5">
                <p className="text-slate-600 mb-0.5">{label}</p>
                <p className="font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
