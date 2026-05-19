import { useState, useEffect, useMemo } from 'react';
import RiskBadge           from '../components/RiskBadge.jsx';
import MetricCard          from '../components/MetricCard.jsx';
import SectionCard         from '../components/SectionCard.jsx';
import LoadingSpinner      from '../components/LoadingSpinner.jsx';
import ErrorBanner         from '../components/ErrorBanner.jsx';
import ProductDetailDrawer from '../components/ProductDetailDrawer.jsx';
import { useLanguage }     from '../context/LanguageContext.jsx';
import { fetchProducts }   from '../api/productApi.js';

function calcRiskScore(p) {
  let score = 0;
  const days = p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales);
  if (days < p.supplierLeadTimeDays) score += 30;
  if (p.salesChange7d < -15) score += 25;
  if (Math.abs(p.competitorPriceChange) > 5) score += 15;
  if (p.trendChange > 30 && p.salesChange7d < 0) score += 20;
  if (p.profitMargin < 20) score += 10;
  return Math.min(score, 100);
}

function riskLevel(score) {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

const SORT_OPTIONS = [
  { value: 'risk_desc',   label: 'Risk Score ↓' },
  { value: 'risk_asc',    label: 'Risk Score ↑' },
  { value: 'name_asc',    label: 'Name A–Z' },
  { value: 'price_desc',  label: 'Price ↓' },
  { value: 'trend_desc',  label: 'Trend ↓' },
  { value: 'roi_desc',    label: 'ROI ↓' },
];

export default function ProductsPage() {
  const { t }                   = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [catFilter, setCat]     = useState('All');
  const [riskFilter, setRisk]   = useState('All');
  const [sortBy, setSort]       = useState('risk_desc');
  const [selected, setSelected] = useState(null);
  const [drawer, setDrawer]     = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(r => {
        const ps = (r.data.data ?? []).map(p => {
          const score = calcRiskScore(p);
          return {
            ...p,
            _riskScore: score,
            _riskLevel: riskLevel(score),
            _daysUntilStockout: p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales),
          };
        });
        setProducts(ps);
        setSelected(ps.find(p => p.id === 'prod_101') ?? ps[0]);
      })
      .catch(() => setError('Cannot reach backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)), [products]);

  const filtered = useMemo(() => {
    let ps = products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat  = catFilter === 'All' || p.category === catFilter;
      const matchRisk = riskFilter === 'All' || p._riskLevel === riskFilter;
      return matchSearch && matchCat && matchRisk;
    });
    ps = [...ps].sort((a, b) => {
      if (sortBy === 'risk_desc')  return b._riskScore - a._riskScore;
      if (sortBy === 'risk_asc')   return a._riskScore - b._riskScore;
      if (sortBy === 'name_asc')   return a.name.localeCompare(b.name);
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'trend_desc') return b.trendChange - a.trendChange;
      if (sortBy === 'roi_desc')   return (b.expectedROI ?? 0) - (a.expectedROI ?? 0);
      return 0;
    });
    return ps;
  }, [products, search, catFilter, riskFilter, sortBy]);

  if (loading) return <LoadingSpinner message="Loading products…" />;
  if (error)   return <ErrorBanner message={error} />;

  const high   = products.filter(p => p._riskLevel === 'HIGH').length;
  const opp    = products.filter(p => p.trendChange >= 30).length;
  const avgRoi = Math.round(products.filter(p => p.expectedROI).reduce((s, p) => s + p.expectedROI, 0) / products.filter(p => p.expectedROI).length);

  return (
    <div className="space-y-5">
      <ProductDetailDrawer product={drawer} onClose={() => setDrawer(null)} />

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('totalProducts')}  value={products.length} description={t('acrossCategories')} color="cyan"  icon="📦" />
        <MetricCard title={t('highRisk')}        value={high}            description={t('requireAttention')} color="red"   icon="🔴" />
        <MetricCard title={t('trendOps')}        value={opp}             description={t('risingDemand')}     color="green" icon="📈" />
        <MetricCard title={t('avgExpectedROI')}  value={`${avgRoi}%`}    description={t('ifActionsExec')}    color="green" icon="🎯" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text" placeholder={t('searchProducts')} value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200
                     placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 w-48"
        />
        <div className="w-px h-7 bg-slate-700" />
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              catFilter === c ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {c}
          </button>
        ))}
        <div className="w-px h-7 bg-slate-700" />
        {['All', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
          <button key={r} onClick={() => setRisk(r)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === r
                ? r === 'HIGH' ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                : r === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : r === 'LOW' ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {r === 'All' ? 'All Risk' : r}
          </button>
        ))}
        <div className="ml-auto">
          <select value={sortBy} onChange={e => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300
                       focus:outline-none focus:border-cyan-500/50">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Product table */}
        <div className="xl:col-span-2">
          <SectionCard title={`${filtered.length} products`} padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {[t('product'), t('category'), t('price'), t('stock'), t('trend'), t('roi'), t('risk')].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map(p => (
                    <tr key={p.id} onClick={() => { setSelected(p); setDrawer(p); }}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${selected?.id === p.id ? 'bg-slate-800/60' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-200 max-w-[160px] truncate">{p.name}</p>
                        <p className="text-slate-600">{p.supplierCountry}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{p.category}</td>
                      <td className="px-4 py-3 font-semibold text-slate-200">₺{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${p._daysUntilStockout < 7 ? 'text-red-400' : p._daysUntilStockout < 14 ? 'text-amber-400' : 'text-green-400'}`}>
                          {p._daysUntilStockout}d
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${p.trendChange >= 30 ? 'text-green-400' : p.trendChange >= 10 ? 'text-cyan-400' : p.trendChange < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                          {p.trendChange >= 0 ? '+' : ''}{p.trendChange}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.expectedROI ? <span className="font-bold text-green-400">{p.expectedROI}%</span> : <span className="text-slate-600">—</span>}
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
            <SectionCard title="Product Detail">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-100">{selected.name}</p>
                  <p className="text-xs text-slate-500">{selected.category} · {selected.supplierCountry}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <RiskBadge level={selected._riskLevel} />
                    {selected.trendChange >= 30 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Trend ↑</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Price',         value: `₺${selected.price.toLocaleString()}` },
                    { label: 'Prev Price',    value: `₺${selected.previousPrice.toLocaleString()}` },
                    { label: 'Stock',         value: `${selected.currentStock} units` },
                    { label: 'Daily Sales',   value: `${selected.avgDailySales}/day` },
                    { label: 'Days Left',     value: `${selected._daysUntilStockout}d`, highlight: selected._daysUntilStockout < 10 },
                    { label: 'Lead Time',     value: `${selected.supplierLeadTimeDays}d` },
                    { label: 'Trend',         value: `${selected.trendChange >= 0 ? '+' : ''}${selected.trendChange}%`, highlight: selected.trendChange >= 30 },
                    { label: 'Sales 7d',      value: `${selected.salesChange7d >= 0 ? '+' : ''}${selected.salesChange7d}%` },
                    { label: 'Margin',        value: `${selected.profitMargin}%` },
                    { label: 'Rating',        value: `${selected.rating}★` },
                    { label: 'Return Rate',   value: `${selected.returnRate}%` },
                    { label: 'Revenue 7d',    value: `₺${(selected.revenue7d / 1000).toFixed(0)}K` },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="rounded-lg bg-slate-800/50 p-2">
                      <p className="text-xs text-slate-600">{label}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${highlight ? 'text-cyan-400' : 'text-slate-200'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {selected.predictedDemandIncrease && (
                  <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-purple-400">AI Intelligence</p>
                    <div className="flex justify-between"><span className="text-xs text-slate-500">Demand Forecast</span><span className="text-xs font-bold text-cyan-400">+{selected.predictedDemandIncrease}%</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-500">Reorder Qty</span><span className="text-xs font-bold text-slate-200">{selected.recommendedReorderQty} units</span></div>
                    {selected.financingNeeded && <div className="flex justify-between"><span className="text-xs text-slate-500">Financing</span><span className="text-xs font-bold text-green-400">₺{selected.financingNeeded.toLocaleString()}</span></div>}
                    {selected.expectedROI && <div className="flex justify-between"><span className="text-xs text-slate-500">Expected ROI</span><span className="text-xs font-bold text-green-400">{selected.expectedROI}%</span></div>}
                  </div>
                )}
              </div>
            </SectionCard>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-600 text-sm">
              Click a product to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
