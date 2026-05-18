import { useState, useEffect, useMemo } from 'react';
import FilterBar      from '../components/FilterBar.jsx';
import SectionCard    from '../components/SectionCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner    from '../components/ErrorBanner.jsx';
import { fetchNews } from '../api/newsApi.js';

const RISK_STYLES = {
  HIGH:   { dot: 'bg-red-400',    badge: 'text-red-400 bg-red-500/10 border-red-500/20'    },
  MEDIUM: { dot: 'bg-amber-400',  badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  LOW:    { dot: 'bg-green-400',  badge: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

const SENTIMENT_STYLES = {
  NEGATIVE: 'text-red-400',
  POSITIVE: 'text-green-400',
  NEUTRAL:  'text-slate-400',
};

const SENTIMENT_ICONS = {
  NEGATIVE: '📉',
  POSITIVE: '📈',
  NEUTRAL:  '➡️',
};

export default function NewsMonitorPage() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [selected, setSelected] = useState(null);

  const [search,        setSearch]        = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSort,    setActiveSort]    = useState('date_desc');

  useEffect(() => {
    fetchNews()
      .then((res) => {
        const data = res.data.data;
        setNews(data);
        setSelected(data[0] ?? null);
      })
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(news.map((n) => n.category))].sort(),
    [news],
  );

  const filtered = useMemo(() => {
    let result = [...news];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.source.toLowerCase().includes(q) || n.category.toLowerCase().includes(q),
      );
    }

    if (activeFilters.risk) {
      result = result.filter((n) => n.riskLevel === activeFilters.risk);
    }

    if (activeFilters.sentiment) {
      result = result.filter((n) => n.sentiment === activeFilters.sentiment);
    }

    if (activeFilters.category) {
      result = result.filter((n) => n.category === activeFilters.category);
    }

    switch (activeSort) {
      case 'date_desc':   result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); break;
      case 'impact_desc': result.sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0)); break;
      case 'risk_high':
        result.sort((a, b) => {
          const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return (order[a.riskLevel] ?? 3) - (order[b.riskLevel] ?? 3);
        });
        break;
    }

    return result;
  }, [news, search, activeFilters, activeSort]);

  if (loading) return <LoadingSpinner message="Loading market intelligence…" />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <div className="space-y-5">

      {/* ── Summary row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-300">{news.length} briefings</span>
        <span className="text-red-400 font-semibold">{news.filter((n) => n.riskLevel === 'HIGH').length} HIGH risk</span>
        <span className="text-green-400 font-semibold">{news.filter((n) => n.sentiment === 'POSITIVE').length} positive</span>
        {filtered.length !== news.length && (
          <span className="text-cyan-400">showing {filtered.length} filtered</span>
        )}
      </div>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search headlines, sources…"
        filters={[
          {
            key: 'risk',
            label: 'Risk',
            options: [
              { value: 'HIGH',   label: 'HIGH' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'LOW',    label: 'LOW' },
            ],
          },
          {
            key: 'sentiment',
            label: 'Sentiment',
            options: [
              { value: 'POSITIVE', label: 'Positive' },
              { value: 'NEGATIVE', label: 'Negative' },
              { value: 'NEUTRAL',  label: 'Neutral' },
            ],
          },
          {
            key: 'category',
            label: 'Category',
            options: categories.map((c) => ({ value: c, label: c })),
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={(key, val) => setActiveFilters((prev) => ({ ...prev, [key]: val }))}
        sortOptions={[
          { value: 'date_desc',   label: 'Newest First' },
          { value: 'impact_desc', label: 'Impact Score ↓' },
          { value: 'risk_high',   label: 'Risk: High First' },
        ]}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      {/* ── News list + detail panel ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* News list */}
        <div className="xl:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">
              <p className="text-sm text-slate-500">No news items match your filters.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const rs = RISK_STYLES[item.riskLevel] ?? RISK_STYLES.LOW;
              const isActive = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-150 ${
                    isActive
                      ? 'border-cyan-500/50 bg-slate-800 ring-1 ring-cyan-500/20'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 shrink-0 h-2 w-2 rounded-full ${rs.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 leading-snug mb-1.5 pr-2">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{item.source}</span>
                        <span className="text-slate-700">·</span>
                        <span className={`font-medium px-1.5 py-0.5 rounded border text-xs ${rs.badge}`}>
                          {item.riskLevel}
                        </span>
                        <span className={`font-medium ${SENTIMENT_STYLES[item.sentiment]}`}>
                          {SENTIMENT_ICONS[item.sentiment]} {item.sentiment}
                        </span>
                        {item.impactScore && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-slate-500">Impact {item.impactScore}/100</span>
                          </>
                        )}
                      </div>
                      {item.affectedCategories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.affectedCategories.map((cat) => (
                            <span key={cat} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-600 whitespace-nowrap">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <SectionCard title={selected.title} description={`${selected.source} · ${selected.category}`}>
              <div className="space-y-3 text-xs">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 rounded border font-semibold ${(RISK_STYLES[selected.riskLevel] ?? RISK_STYLES.LOW).badge}`}>
                    {selected.riskLevel} Risk
                  </span>
                  <span className={`font-semibold ${SENTIMENT_STYLES[selected.sentiment]}`}>
                    {SENTIMENT_ICONS[selected.sentiment]} {selected.sentiment}
                  </span>
                  {selected.impactScore && (
                    <span className="text-slate-400">Impact {selected.impactScore}/100</span>
                  )}
                </div>

                <div>
                  <p className="text-slate-600 uppercase tracking-widest font-semibold mb-1.5">Summary</p>
                  <p className="text-slate-300 leading-relaxed">{selected.summary}</p>
                </div>

                {selected.suggestedAction && (
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-2.5">
                    <p className="font-semibold text-cyan-400 mb-1">🎯 Suggested Action</p>
                    <p className="text-cyan-300/80 leading-relaxed">{selected.suggestedAction}</p>
                  </div>
                )}

                {selected.affectedCategories?.length > 0 && (
                  <div>
                    <p className="text-slate-600 uppercase tracking-widest font-semibold mb-1.5">Affected Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.affectedCategories.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-slate-600 pt-1">
                  Published {new Date(selected.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
            </SectionCard>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">
              <p className="text-xs text-slate-600">Click a headline to read full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
