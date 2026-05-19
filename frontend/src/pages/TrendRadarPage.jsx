import { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import FilterBar     from '../components/FilterBar.jsx';
import SectionCard   from '../components/SectionCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner   from '../components/ErrorBanner.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchMarketSignals } from '../api/marketSignalApi.js';

const OPPORTUNITY_COLORS = {
  HIGH:   { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  MEDIUM: { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  LOW:    { text: 'text-slate-400',  bg: 'bg-slate-700/40',  border: 'border-slate-600/30'  },
};

const SIGNAL_TYPE_LABELS = {
  SEARCH_SURGE:    '🔍 Search Surge',
  TREND_DIVERGENCE:'⚡ Trend Divergence',
  GROWING_INTEREST:'🌱 Growing Interest',
  SOCIAL_SPIKE:    '📱 Social Spike',
  SEASONAL_SURGE:  '🍂 Seasonal Surge',
  STABLE_GROWTH:   '📈 Stable Growth',
};

const CONFIDENCE_COLORS = {
  HIGH:   'text-green-400',
  MEDIUM: 'text-amber-400',
  LOW:    'text-slate-400',
};

export default function TrendRadarPage() {
  const { t }                  = useLanguage();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [search,        setSearch]        = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSort,    setActiveSort]    = useState('trend_desc');
  const [selected,      setSelected]      = useState(null);

  useEffect(() => {
    fetchMarketSignals()
      .then((res) => {
        const data = res.data.data;
        setSignals(data);
        setSelected(data[0] ?? null);
      })
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(signals.map((s) => s.category))].sort(),
    [signals],
  );

  const filtered = useMemo(() => {
    let result = [...signals];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.keyword.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
      );
    }

    if (activeFilters.category) {
      result = result.filter((s) => s.category === activeFilters.category);
    }

    if (activeFilters.opportunity) {
      result = result.filter((s) => s.opportunityLevel === activeFilters.opportunity);
    }

    switch (activeSort) {
      case 'trend_desc':  result.sort((a, b) => b.trendChange - a.trendChange); break;
      case 'trend_asc':   result.sort((a, b) => a.trendChange - b.trendChange); break;
      case 'alpha':       result.sort((a, b) => a.keyword.localeCompare(b.keyword)); break;
    }

    return result;
  }, [signals, search, activeFilters, activeSort]);

  const chartData = useMemo(
    () =>
      [...signals]
        .sort((a, b) => b.trendChange - a.trendChange)
        .slice(0, 8)
        .map((s) => ({ name: s.keyword.split(' ').slice(0, 2).join(' '), trend: s.trendChange, full: s.keyword })),
    [signals],
  );

  if (loading) return <LoadingSpinner message="Loading trend signals…" />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <div className="space-y-5">

      {/* ── Bar chart ─────────────────────────────────────────────── */}
      <SectionCard title={t('trendChangeComparison')} description={t('trendChartDesc')}>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => `+${v}%`} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#22d3ee' }}
                formatter={(v, _, props) => [`+${v}%`, props.payload.full]}
              />
              <Bar dataKey="trend" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.trend >= 50 ? '#22d3ee' : entry.trend >= 30 ? '#38bdf8' : '#0ea5e9'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('searchKeywords')}
        filters={[
          {
            key: 'category',
            label: t('categoryFilter'),
            options: categories.map((c) => ({ value: c, label: c })),
          },
          {
            key: 'opportunity',
            label: t('opportunityFilter'),
            options: [
              { value: 'HIGH',   label: 'HIGH' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'LOW',    label: 'LOW' },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={(key, val) => setActiveFilters((prev) => ({ ...prev, [key]: val }))}
        sortOptions={[
          { value: 'trend_desc', label: 'Trend ↓' },
          { value: 'trend_asc',  label: 'Trend ↑' },
          { value: 'alpha',      label: 'A–Z' },
        ]}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      {/* ── Signal cards + detail ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((sig) => {
            const oc = OPPORTUNITY_COLORS[sig.opportunityLevel] ?? OPPORTUNITY_COLORS.LOW;
            const isActive = selected?.id === sig.id;
            return (
              <button
                key={sig.id}
                onClick={() => setSelected(sig)}
                className={`text-left rounded-xl border p-4 transition-all duration-150 ${
                  isActive
                    ? 'border-cyan-500/50 bg-slate-800 ring-1 ring-cyan-500/20'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${oc.text} ${oc.bg} ${oc.border}`}>
                    {sig.opportunityLevel}
                  </span>
                  <span className="text-lg font-bold text-green-400">+{sig.trendChange}%</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 leading-snug mb-1">{sig.keyword}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{sig.category}</span>
                  <span className="text-slate-700">·</span>
                  <span>{SIGNAL_TYPE_LABELS[sig.signalType] ?? sig.signalType}</span>
                </div>
                {sig.region && (
                  <p className="text-xs text-slate-600 mt-1">📍 {sig.region}</p>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 rounded-xl border border-dashed border-slate-800 p-10 text-center">
              <p className="text-sm text-slate-500">{t('noSignalsMatch')}</p>
            </div>
          )}
        </div>

        {/* Signal detail panel */}
        <div>
          {selected ? (
            <SectionCard
              title={selected.keyword}
              description={`${selected.category} · ${SIGNAL_TYPE_LABELS[selected.signalType] ?? selected.signalType}`}
            >
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-800/60 p-2">
                    <p className="text-slate-600 mb-0.5">{t('trendChangeLabel')}</p>
                    <p className="font-bold text-green-400 text-sm">+{selected.trendChange}%</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-2">
                    <p className="text-slate-600 mb-0.5">{t('opportunity')}</p>
                    <p className={`font-bold ${OPPORTUNITY_COLORS[selected.opportunityLevel]?.text}`}>
                      {selected.opportunityLevel}
                    </p>
                  </div>
                  {selected.confidence && (
                    <div className="rounded-lg bg-slate-800/60 p-2">
                      <p className="text-slate-600 mb-0.5">{t('confidence')}</p>
                      <p className={`font-bold ${CONFIDENCE_COLORS[selected.confidence]}`}>
                        {selected.confidence}
                      </p>
                    </div>
                  )}
                  {selected.region && (
                    <div className="rounded-lg bg-slate-800/60 p-2">
                      <p className="text-slate-600 mb-0.5">Region</p>
                      <p className="font-semibold text-slate-200">{selected.region}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-slate-600 uppercase tracking-widest font-semibold mb-1.5">{t('signalAnalysis')}</p>
                  <p className="text-slate-300 leading-relaxed">{selected.explanation}</p>
                </div>

                {selected.suggestedAction && (
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-2.5">
                    <p className="font-semibold text-cyan-400 mb-1">{t('suggestedActionLabel')}</p>
                    <p className="text-cyan-300/80 leading-relaxed">{selected.suggestedAction}</p>
                  </div>
                )}

                {selected.relatedProducts?.length > 0 && (
                  <div>
                    <p className="text-slate-600 uppercase tracking-widest font-semibold mb-1">{t('relatedProducts')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.relatedProducts.map((id) => (
                        <span key={id} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">
              <p className="text-xs text-slate-600">{t('clickSignalDetail')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
