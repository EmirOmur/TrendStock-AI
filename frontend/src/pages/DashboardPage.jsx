import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetricCard    from '../components/MetricCard.jsx';
import SectionCard   from '../components/SectionCard.jsx';
import RiskBadge     from '../components/RiskBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner   from '../components/ErrorBanner.jsx';
import { fetchOverview } from '../api/productApi.js';
import { fetchNews }     from '../api/marketApi.js';
import { fetchMarketSignals } from '../api/marketSignalApi.js';

export default function DashboardPage() {
  const [overview, setOverview]   = useState(null);
  const [news, setNews]           = useState([]);
  const [signals, setSignals]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    Promise.allSettled([
      fetchOverview(),
      fetchNews(),
      fetchMarketSignals(),
    ]).then(([ovRes, newsRes, sigRes]) => {
      if (ovRes.status === 'fulfilled') setOverview(ovRes.value.data.data);
      else setError('Could not connect to the backend. Make sure it is running on port 5000.');

      if (newsRes.status === 'fulfilled') setNews(newsRes.value.data.data.slice(0, 4));
      if (sigRes.status === 'fulfilled')  setSignals(sigRes.value.data.data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard data…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { totals, financials, topRisky } = overview;

  return (
    <div className="space-y-5">

      {/* ── KPI cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          title="High Risk Products"
          value={totals.highRisk}
          description={`of ${totals.products} monitored`}
          color="red"
          icon="🔴"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`$${financials.revenueAtRisk.toLocaleString()}`}
          description="7-day HIGH risk estimate"
          color="amber"
          icon="💸"
        />
        <MetricCard
          title="Trend Opportunities"
          value={totals.trendOpportunity}
          description="Rising search trends"
          color="cyan"
          icon="📈"
        />
        <MetricCard
          title="Stockout Alerts"
          value={totals.stockoutRisk}
          description="Stock < lead time"
          color="red"
          icon="⚠️"
        />
      </div>

      {/* ── Second row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          title="Avg Risk Score"
          value={`${financials.avgRiskScore}/100`}
          description="Across all products"
          color="amber"
          icon="📊"
        />
        <MetricCard
          title="Sales Drops"
          value={totals.salesDrop}
          description=">15% decline this week"
          color="red"
          icon="📉"
        />
        <MetricCard
          title="Price Pressure"
          value={totals.pricePressure}
          description="Competitor price shifts"
          color="amber"
          icon="⚡"
        />
        <MetricCard
          title="Total Revenue 7d"
          value={`$${financials.totalRevenue7d.toLocaleString()}`}
          description="All products combined"
          color="cyan"
          icon="💰"
        />
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Top risky products */}
        <div className="xl:col-span-2">
          <SectionCard
            title="Top 5 Highest Risk Products"
            description="Sorted by risk score — click a row to analyze"
            right={
              <Link to="/products"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                View all →
              </Link>
            }
            padding={false}
          >
            <div className="divide-y divide-slate-800">
              {topRisky.map((p, i) => (
                <Link
                  key={p.id}
                  to="/ai-analysis"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-600 w-4">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
                    <p className="text-xs text-slate-600">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.isStockoutRisk && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Stockout
                      </span>
                    )}
                    {p.isTrendOpportunity && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Trend ↑
                      </span>
                    )}
                    <span className={`text-xs font-bold ${
                      p.riskLevel === 'HIGH' ? 'text-red-400' :
                      p.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {p.riskScore}
                    </span>
                    <RiskBadge level={p.riskLevel} />
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <SectionCard title="Quick Actions" description="Jump to key workflows">
            <div className="space-y-2">
              {[
                { to: '/ai-analysis',    icon: '🤖', label: 'Run Gemini Analysis',    sub: 'Analyze product risk with AI' },
                { to: '/products',       icon: '📦', label: 'Browse All Products',     sub: 'Filter, search, and sort' },
                { to: '/trend-radar',    icon: '📡', label: 'Check Trend Signals',     sub: '12 active market signals' },
                { to: '/sales-forecast', icon: '📈', label: 'View Sales Forecast',     sub: 'Actual vs predicted trends' },
                { to: '/news-monitor',   icon: '📰', label: 'Read Market News',        sub: '12 intelligence briefings' },
              ].map(({ to, icon, label, sub }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60
                             hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600
                             transition-all group"
                >
                  <span className="text-lg leading-none">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-slate-100">{label}</p>
                    <p className="text-xs text-slate-600">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── News + Signals preview ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Latest news */}
        <SectionCard
          title="Latest Market Intelligence"
          right={
            <Link to="/news-monitor"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              View all →
            </Link>
          }
          padding={false}
        >
          <div className="divide-y divide-slate-800">
            {news.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 h-1.5 w-1.5 rounded-full ${
                    item.riskLevel === 'HIGH' ? 'bg-red-400' :
                    item.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-green-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.source} · {item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top trend signals */}
        <SectionCard
          title="Top Trend Signals"
          right={
            <Link to="/trend-radar"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              View all →
            </Link>
          }
          padding={false}
        >
          <div className="divide-y divide-slate-800">
            {signals.map((sig) => (
              <div key={sig.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {sig.keyword}
                  </p>
                  <p className="text-xs text-slate-600">{sig.category} · {sig.signalType.replace(/_/g, ' ')}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold ${
                  sig.trendChange >= 40 ? 'text-green-400' :
                  sig.trendChange >= 20 ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  +{sig.trendChange}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
