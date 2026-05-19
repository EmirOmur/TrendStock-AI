import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import MetricCard      from '../components/MetricCard.jsx';
import SectionCard     from '../components/SectionCard.jsx';
import RiskBadge       from '../components/RiskBadge.jsx';
import LoadingSpinner  from '../components/LoadingSpinner.jsx';
import ErrorBanner     from '../components/ErrorBanner.jsx';
import ChartCard       from '../components/ChartCard.jsx';
import ActionCenter    from '../components/ActionCenter.jsx';
import DemoWalkthrough from '../components/DemoWalkthrough.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getDashboardSummary } from '../api/dashboardApi.js';
import { getActions }          from '../api/actionsApi.js';

const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };

export default function DashboardPage() {
  const { t }                 = useLanguage();
  const [data, setData]       = useState(null);
  const [loading, setLoad]    = useState(true);
  const [error, setError]     = useState(null);
  const [actions, setActions] = useState([]);
  const [showDemo, setDemo]   = useState(false);

  useEffect(() => {
    getDashboardSummary()
      .then(r => setData(r.data.data))
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5001.'))
      .finally(() => setLoad(false));
    getActions()
      .then(r => setActions(r.data.data ?? []))
      .catch(() => {});
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { totals, financials, heroRecommendation, topRisky, revenueTrend, categoryChart } = data;

  return (
    <div className="space-y-5">
      {showDemo && <DemoWalkthrough onClose={() => setDemo(false)} />}

      {/* ── Hero AI recommendation ──────────────────────────────────── */}
      {heroRecommendation && (
        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/40 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center shrink-0">
              <span className="text-base">🤖</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">{t('aiCoreScenario')}</p>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">{heroRecommendation.productName}</h2>
            </div>
            <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 font-semibold shrink-0">
              ROI {heroRecommendation.expectedROI}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('demandTrend'),   value: heroRecommendation.trend,         icon: '📈', color: 'text-cyan-400' },
              { label: t('inventoryRisk'), value: heroRecommendation.inventoryRisk,  icon: '⚠️', color: 'text-red-400' },
              { label: t('pricingAction'), value: heroRecommendation.pricingAction,  icon: '💹', color: 'text-amber-400' },
              { label: t('fintechAction'), value: heroRecommendation.fintechAction,  icon: '💳', color: 'text-green-400' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="rounded-lg bg-slate-900/70 border border-slate-800 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{icon}</span>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
                <p className={`text-xs font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Link to="/fintech-actions"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600
                         text-white text-xs font-semibold hover:from-green-500 hover:to-emerald-500 transition-all">
              {t('viewCreditOffer')}
            </Link>
            <Link to="/inventory"
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium
                         hover:border-slate-600 hover:text-slate-100 transition-colors">
              {t('seeInventoryPlan')}
            </Link>
            <Link to="/ai-agent-console"
              className="px-4 py-2 rounded-lg border border-purple-700/50 text-purple-400 text-xs font-medium
                         hover:border-purple-600/50 hover:text-purple-300 transition-colors">
              {t('agentReasoning')}
            </Link>
            <button onClick={() => setDemo(true)}
              className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700
                         text-white text-xs font-semibold hover:from-violet-500 hover:to-purple-600 transition-all">
              {t('startDemo')}
            </button>
          </div>
        </div>
      )}

      {/* ── KPI Row 1 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('totalRevenue7d')}   value={`₺${(financials.totalRevenue7d / 1000).toFixed(0)}K`} description="All 25 products" color="cyan" icon="💰" />
        <MetricCard title={t('revenueAtRisk')}    value={`₺${(financials.revenueAtRisk / 1000).toFixed(0)}K`} description="From stockouts & risk" color="red" icon="💸" />
        <MetricCard title={t('highRiskProducts')} value={totals.highRisk} description={`of ${totals.products} ${t('monitored')}`} color="red" icon="🔴" />
        <MetricCard title={t('stockoutAlerts')}   value={totals.stockoutRisk} description={t('stockBelowLead')} color="amber" icon="⚠️" />
      </div>

      {/* ── KPI Row 2 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('trendOpportunities')} value={totals.trendOpportunity}         description={t('risingDemand')}    color="cyan"  icon="📈" />
        <MetricCard title={t('avgRiskScore')}        value={`${financials.avgRiskScore}/100`} description={t('acrossCategories')} color="amber" icon="📊" />
        <MetricCard title={t('financingOps')}        value={totals.financingOpportunities}   description="Active credit offers" color="green" icon="💳" />
        <MetricCard title={t('expectedROI')}         value={`${financials.expectedROIFromActions}%`} description={t('ifActionsExec')} color="green" icon="🎯" />
      </div>

      {/* ── Charts + Top Risk ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue chart */}
        <ChartCard title={t('revenueTrend')} description={t('dailyRevenue')} className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                formatter={v => [`₺${v.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category chart */}
        <ChartCard title={t('revenueByCategory')} description={t('revenueDistrib')}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryChart} layout="vertical">
              <XAxis type="number" stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" stroke="#475569" tick={{ fontSize: 10 }} width={70} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                formatter={v => [`₺${v.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {categoryChart.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#06b6d4' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Action Center ──────────────────────────────────────────── */}
      {actions.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <ActionCenter actions={actions} />
        </div>
      )}

      {/* ── Top Risky + Quick Actions ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2">
          <SectionCard
            title={t('topRiskyProducts')}
            description={t('sortedByRisk')}
            right={<Link to="/products" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">{t('viewAll')}</Link>}
            padding={false}
          >
            <div className="divide-y divide-slate-800">
              {topRisky.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors">
                  <span className="text-xs font-bold text-slate-600 w-4">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
                    <p className="text-xs text-slate-600">{p.category} · {p.daysUntilStockout}d stock</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.isStockoutRisk && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Stockout</span>
                    )}
                    {p.isTrendOpportunity && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Trend ↑</span>
                    )}
                    <span className={`text-sm font-bold ${RISK_COLORS[p.riskLevel] ? '' : ''}`}
                      style={{ color: RISK_COLORS[p.riskLevel] }}>
                      {p.riskScore}
                    </span>
                    <RiskBadge level={p.riskLevel} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-3">
          <SectionCard title={t('quickActions')} description={t('jumpToWorkflows')}>
            <div className="space-y-2">
              {[
                { to: '/fintech-actions',   icon: '💳', label: 'View Credit Offers',       sub: '₺85,000 micro-credit available' },
                { to: '/inventory',         icon: '🗄️', label: 'Inventory Intelligence',   sub: '7 products at stockout risk' },
                { to: '/dynamic-pricing',   icon: '💹', label: 'Pricing Recommendations',  sub: '+7% earbuds price suggested' },
                { to: '/ai-agent-console',  icon: '🤖', label: 'AI Agent Console',         sub: '6 agents · 24% ROI plan' },
                { to: '/reports',           icon: '📊', label: 'Weekly Report',             sub: 'Week 20 summary ready' },
              ].map(({ to, icon, label, sub }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60
                             hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600
                             transition-all group">
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
    </div>
  );
}
