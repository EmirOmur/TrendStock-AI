import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate }      from 'react-router-dom';
import LoadingSpinner        from '../components/LoadingSpinner.jsx';
import ErrorBanner           from '../components/ErrorBanner.jsx';
import RiskBadge             from '../components/RiskBadge.jsx';
import MetricCard            from '../components/MetricCard.jsx';
import SectionCard           from '../components/SectionCard.jsx';
import ChartCard             from '../components/ChartCard.jsx';
import ExplainabilityPanel   from '../components/ExplainabilityPanel.jsx';
import { useLanguage }       from '../context/LanguageContext.jsx';
import { fetchProducts }     from '../api/productApi.js';

const CATS = ['All', 'Electronics', 'Gaming', 'Beauty', 'Coffee', 'Home', 'Fashion', 'Sports', 'Grocery', 'Pet Supplies', 'Office'];
const RISK_LEVELS = ['All', 'HIGH', 'MEDIUM', 'LOW'];

function riskLevel(p) {
  const days = p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales);
  if (days < p.supplierLeadTimeDays) return 'HIGH';
  if (days < p.supplierLeadTimeDays * 1.5) return 'MEDIUM';
  return 'LOW';
}

export default function InventoryIntelligencePage() {
  const navigate                = useNavigate();
  const { t }                   = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoad]      = useState(true);
  const [error, setError]       = useState(null);
  const [catFilter, setCat]     = useState('All');
  const [riskFilter, setRisk]   = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(r => {
        const ps = (r.data.data ?? []).map(p => ({
          ...p,
          _daysUntilStockout: p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales),
          _riskLevel: riskLevel(p),
        }));
        setProducts(ps);
        setSelected(ps.find(p => p.id === 'prod_101') ?? ps[0]);
      })
      .catch(() => setError('Cannot reach backend. Make sure it is running on port 5000.'))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading inventory data…" />;
  if (error)   return <ErrorBanner message={error} />;

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (riskFilter === 'All' || p._riskLevel === riskFilter)
  );

  const high   = products.filter(p => p._riskLevel === 'HIGH').length;
  const medium = products.filter(p => p._riskLevel === 'MEDIUM').length;
  const critical = products.filter(p => p._daysUntilStockout < 7).length;
  const totalReorder = products.filter(p => p._riskLevel === 'HIGH')
    .reduce((s, p) => s + (p.financingNeeded ?? 0), 0);

  const chartData = filtered.slice(0, 10).map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    days: p._daysUntilStockout,
    lead: p.supplierLeadTimeDays,
  }));

  return (
    <div className="space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('criticalStockout')} value={critical}  description={t('under7days')}      color="red"   icon="🚨" />
        <MetricCard title={t('highRiskProducts')} value={high}      description={t('stockBelowLead')}  color="amber" icon="⚠️" />
        <MetricCard title={t('mediumRisk')}       value={medium}    description={t('stockBelowX')}     color="amber" icon="📊" />
        <MetricCard title={t('reorderCapital')}   value={`₺${(totalReorder/1000).toFixed(0)}K`} description={t('highRiskRestock')} color="blue" icon="💰" />
      </div>

      {/* Core demo callout */}
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-sm font-bold text-red-300">CRITICAL: SoundPulse Pro Wireless Earbuds — Stockout in 6 Days</p>
            <p className="text-xs text-red-400/80 mt-1">
              Current stock: 72 units · Daily sales: 12 units · Supplier lead time: 10 days.
              Demand forecast shows +42% increase. Stock gap: 4 days before supplier can deliver.
              Recommended reorder: <strong className="text-red-300">450 units (₺85,000)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              catFilter === c ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {c}
          </button>
        ))}
        <div className="w-px h-7 bg-slate-700 self-center" />
        {RISK_LEVELS.map(r => (
          <button key={r} onClick={() => setRisk(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === r
                ? r === 'HIGH' ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                : r === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : r === 'LOW' ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Product table */}
        <div className="xl:col-span-2">
          <SectionCard title={`${t('inventoryStatus')} (${filtered.length})`} padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {[t('product'), t('stock'), t('dailySales'), t('daysLeft'), t('leadTime'), t('reorderQty'), t('risk')].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map(p => (
                    <tr key={p.id} onClick={() => setSelected(p)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${selected?.id === p.id ? 'bg-slate-800/60' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-200 truncate max-w-[180px]">{p.name}</p>
                        <p className="text-slate-600">{p.category}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-200">{p.currentStock}</p>
                        <p className="text-slate-600">units</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{p.avgDailySales}/day</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${p._daysUntilStockout < 7 ? 'text-red-400' : p._daysUntilStockout < 14 ? 'text-amber-400' : 'text-green-400'}`}>
                          {p._daysUntilStockout}d
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{p.supplierLeadTimeDays}d</td>
                      <td className="px-4 py-3">
                        {p.recommendedReorderQty ? (
                          <span className="text-cyan-400 font-semibold">{p.recommendedReorderQty}</span>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={p._riskLevel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <>
              <SectionCard title={t('productDetail')}>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-bold text-slate-100">{selected.name}</p>
                    <p className="text-xs text-slate-500">{selected.category} · {selected.supplierCountry}</p>
                  </div>
                  <RiskBadge level={selected._riskLevel} />

                  {[
                    { label: 'Current Stock',     value: `${selected.currentStock} units` },
                    { label: 'Avg Daily Sales',   value: `${selected.avgDailySales} units/day` },
                    { label: 'Days Until Stockout', value: `${selected._daysUntilStockout} days`, highlight: selected._daysUntilStockout < 10 },
                    { label: 'Lead Time',         value: `${selected.supplierLeadTimeDays} days` },
                    { label: 'Demand Forecast',   value: selected.predictedDemandIncrease ? `+${selected.predictedDemandIncrease}%` : 'Stable', highlight: (selected.predictedDemandIncrease ?? 0) >= 30 },
                    { label: 'Reorder Qty',       value: selected.recommendedReorderQty ? `${selected.recommendedReorderQty} units` : '—' },
                    { label: 'Financing Needed',  value: selected.financingNeeded ? `₺${selected.financingNeeded.toLocaleString()}` : '—' },
                    { label: 'Expected ROI',      value: selected.expectedROI ? `${selected.expectedROI}%` : '—', highlight: (selected.expectedROI ?? 0) >= 20 },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className={`text-xs font-semibold ${highlight ? 'text-cyan-400' : 'text-slate-200'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {selected._riskLevel === 'HIGH' && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                  <p className="text-xs font-semibold text-amber-400 mb-2">🤖 {t('aiRecommendation')}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Reorder <strong className="text-amber-300">{selected.recommendedReorderQty} units</strong> immediately.
                    With a {selected.supplierLeadTimeDays}-day lead time and only {selected._daysUntilStockout} days of stock remaining,
                    you face a {Math.max(0, selected.supplierLeadTimeDays - selected._daysUntilStockout)}-day stockout gap.
                    {selected.financingNeeded ? ` Financing of ₺${selected.financingNeeded.toLocaleString()} available via Fintech Actions.` : ''}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-600 text-sm">
              Click a product row to see details
            </div>
          )}
        </div>
      </div>

      {/* Explainability + Primary CTA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <ExplainabilityPanel
          title="Why the Earbuds Reorder Alert?"
          reasons={[
            '72 units remaining ÷ 12 avg daily sales = 6 days of stock left.',
            'Supplier lead time is 10 days — stockout gap of 4 days if not reordered today.',
            'Trend score up 42% — demand will accelerate, not slow down.',
            'Recommended reorder qty of 450 units is based on 30-day demand forecast.',
            '₺85,000 micro-credit is available to fund the reorder with 24% projected ROI.',
            'Delay of even 1 day increases stockout probability from 78% to 94%.',
          ]}
        />
        <div className="flex justify-end items-end h-full">
          <button
            onClick={() => navigate('/fintech-actions')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600
                       text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg">
            {t('createReorderPlan')}
          </button>
        </div>
      </div>

      {/* Chart */}
      <ChartCard title="Days Until Stockout vs Lead Time" description="Products where bar is below lead time line are at risk">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="days" name="Days Until Stockout" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            <Bar dataKey="lead" name="Supplier Lead Time" fill="#7c3aed" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
