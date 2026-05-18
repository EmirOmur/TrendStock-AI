import { useState, useEffect, useMemo } from 'react';
import ProductCard   from '../components/ProductCard.jsx';
import FilterBar     from '../components/FilterBar.jsx';
import SectionCard   from '../components/SectionCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner   from '../components/ErrorBanner.jsx';
import { fetchAlerts } from '../api/productApi.js';

const SORT_OPTIONS = [
  { value: 'risk_desc',   label: 'Risk Score ↓' },
  { value: 'risk_asc',    label: 'Risk Score ↑' },
  { value: 'name_asc',    label: 'Name A–Z' },
  { value: 'price_desc',  label: 'Price ↓' },
  { value: 'margin_desc', label: 'Margin ↓' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [search,       setSearch]       = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSort,   setActiveSort]   = useState('risk_desc');
  const [selected,     setSelected]     = useState(null);

  useEffect(() => {
    fetchAlerts()
      .then((res) => setProducts(res.data.data))
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  // Unique categories derived from data
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplierCountry.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (activeFilters.category) {
      result = result.filter((p) => p.category === activeFilters.category);
    }

    // Risk level filter
    if (activeFilters.risk) {
      result = result.filter((p) => p.riskMetrics?.level === activeFilters.risk);
    }

    // Sort
    switch (activeSort) {
      case 'risk_desc':   result.sort((a, b) => (b.riskMetrics?.score ?? 0) - (a.riskMetrics?.score ?? 0)); break;
      case 'risk_asc':    result.sort((a, b) => (a.riskMetrics?.score ?? 0) - (b.riskMetrics?.score ?? 0)); break;
      case 'name_asc':    result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'price_desc':  result.sort((a, b) => b.price - a.price); break;
      case 'margin_desc': result.sort((a, b) => b.profitMargin - a.profitMargin); break;
    }

    return result;
  }, [products, search, activeFilters, activeSort]);

  if (loading) return <LoadingSpinner message="Loading products…" />;
  if (error)   return <ErrorBanner message={error} />;

  const high   = products.filter((p) => p.riskMetrics?.level === 'HIGH').length;
  const medium = products.filter((p) => p.riskMetrics?.level === 'MEDIUM').length;
  const low    = products.filter((p) => p.riskMetrics?.level === 'LOW').length;

  return (
    <div className="space-y-5">

      {/* ── Summary bar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-300">{products.length} products</span>
        <span className="text-red-400 font-semibold">{high} HIGH</span>
        <span className="text-amber-400 font-semibold">{medium} MEDIUM</span>
        <span className="text-green-400 font-semibold">{low} LOW</span>
        {filtered.length !== products.length && (
          <span className="text-cyan-400">showing {filtered.length} filtered</span>
        )}
      </div>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products, categories…"
        filters={[
          {
            key: 'category',
            label: 'Category',
            options: categories.map((c) => ({ value: c, label: c })),
          },
          {
            key: 'risk',
            label: 'Risk',
            options: [
              { value: 'HIGH',   label: 'HIGH' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'LOW',    label: 'LOW' },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={(key, val) => setActiveFilters((prev) => ({ ...prev, [key]: val }))}
        sortOptions={SORT_OPTIONS}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      {/* ── Product grid + detail panel ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">
              <p className="text-sm text-slate-500">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selected?.id === product.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <SectionCard title={selected.name} description={`${selected.category} · ${selected.supplierCountry}`}>
              <div className="space-y-3 text-xs">

                {/* Risk summary */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Risk Score</span>
                  <span className={`font-bold text-sm ${
                    selected.riskMetrics.level === 'HIGH' ? 'text-red-400' :
                    selected.riskMetrics.level === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {selected.riskMetrics.score} / 100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Price',        value: `$${selected.price}` },
                    { label: 'Margin',       value: `${selected.profitMargin}%` },
                    { label: 'Stock',        value: `${selected.currentStock} units` },
                    { label: 'Days Left',    value: `${selected.riskMetrics.daysUntilStockout}d` },
                    { label: 'Sales 7d',     value: `${selected.salesChange7d > 0 ? '+' : ''}${selected.salesChange7d}%` },
                    { label: 'Trend',        value: `+${selected.trendChange}%` },
                    { label: 'Avg/Day',      value: `${selected.avgDailySales} units` },
                    { label: 'Lead Time',    value: `${selected.supplierLeadTimeDays}d` },
                    { label: 'Revenue 7d',   value: `$${(selected.revenue7d || 0).toLocaleString()}` },
                    { label: 'Units 7d',     value: `${selected.unitsSold7d || '—'}` },
                    { label: 'Return Rate',  value: `${selected.returnRate || '—'}%` },
                    { label: 'Rating',       value: `⭐ ${selected.rating || '—'}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-slate-800/60 p-2">
                      <p className="text-slate-600 mb-0.5">{label}</p>
                      <p className="font-semibold text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Risk flags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selected.riskMetrics.isStockoutRisk && <Chip color="red">⚠️ Stockout Risk</Chip>}
                  {selected.riskMetrics.isSalesDrop    && <Chip color="orange">📉 Sales Drop</Chip>}
                  {selected.riskMetrics.isTrendOpportunity && <Chip color="cyan">📈 Trend ↑</Chip>}
                  {selected.riskMetrics.isPricePressure    && <Chip color="purple">⚡ Price War</Chip>}
                  {selected.riskMetrics.score === 0        && <Chip color="green">✓ Healthy</Chip>}
                </div>

                {/* Risk factors */}
                {selected.riskMetrics.factors?.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-slate-600 uppercase tracking-widest text-xs font-semibold">Risk Factors</p>
                    {selected.riskMetrics.factors.map((f) => (
                      <div key={f.type} className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-2">
                        <p className="font-semibold text-slate-300">{f.type.replace(/_/g, ' ')} <span className="text-red-400">+{f.points}pts</span></p>
                        <p className="text-slate-500 leading-relaxed mt-0.5">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-10
                            text-center flex flex-col items-center gap-3">
              <span className="text-4xl opacity-20">📦</span>
              <p className="text-sm font-medium text-slate-500">Select a product</p>
              <p className="text-xs text-slate-700">Click any card to view detailed metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ color, children }) {
  const map = {
    red:    'bg-red-500/10 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    cyan:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    green:  'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs border font-medium ${map[color]}`}>
      {children}
    </span>
  );
}
