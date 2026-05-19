import { useState, useEffect } from 'react';
import { useNavigate }    from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import LoadingSpinner     from '../components/LoadingSpinner.jsx';
import ErrorBanner        from '../components/ErrorBanner.jsx';
import MetricCard         from '../components/MetricCard.jsx';
import SectionCard        from '../components/SectionCard.jsx';
import ChartCard          from '../components/ChartCard.jsx';
import StatusBadge        from '../components/StatusBadge.jsx';
import ExplainabilityPanel from '../components/ExplainabilityPanel.jsx';
import { getSupplyChainRisks } from '../api/supplyChainApi.js';

const SEV_COLORS   = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const SOURCE_ICONS = { logistics: '🚢', raw_material: '🏭', currency: '💱', labor: '👷', regulatory: '📋', component: '🔌' };

export default function SupplyChainRiskPage() {
  const navigate             = useNavigate();
  const { t }                = useLanguage();
  const [data, setData]      = useState(null);
  const [loading, setLoad]   = useState(true);
  const [error, setError]    = useState(null);
  const [sevFilter, setSev]  = useState('all');
  const [selected, setSel]   = useState(null);

  useEffect(() => {
    getSupplyChainRisks()
      .then(r => { setData(r.data.data); setSel(r.data.data.risks[0]); })
      .catch(() => setError('Cannot reach backend.'))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading supply chain risks…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { risks, summary } = data;
  const filtered = sevFilter === 'all' ? risks : risks.filter(r => r.severity === sevFilter);

  const chartData = risks.map(r => ({
    name: r.title.split(' ').slice(0, 3).join(' '),
    impact: Math.abs(r.estimatedFinancialImpact),
    probability: r.probability,
    color: SEV_COLORS[r.severity] ?? '#6b7280',
  }));

  return (
    <div className="space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('totalRisks')}          value={summary.total}  description={t('activeRisks')}       color="amber" icon="⚠️" />
        <MetricCard title={t('highSeverity')}         value={summary.high}   description={t('requireImmediate')}  color="red"   icon="🔴" />
        <MetricCard title={t('mediumSeverity')}       value={summary.medium} description={t('monitorClosely')}    color="amber" icon="🟡" />
        <MetricCard title={t('totalPotentialImpact')} value={`₺${(summary.totalFinancialImpact/1000).toFixed(0)}K`} description={t('acrossAllRisks')} color="blue" icon="💸" />
      </div>

      {/* Severity filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'high', 'medium', 'low'].map(s => (
          <button key={s} onClick={() => setSev(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sevFilter === s
                ? s === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                : s === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : s === 'low' ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {s === 'all' ? 'All Risks' : s.charAt(0).toUpperCase() + s.slice(1) + ' Severity'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Risk list */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map(risk => (
            <div key={risk.id} onClick={() => setSel(risk)}
              className={`rounded-xl border bg-slate-900 p-4 cursor-pointer transition-all
                border-l-4 ${SEV_COLORS[risk.severity] ? '' : ''}
                ${selected?.id === risk.id ? 'border-cyan-500/30 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'}`}
              style={{ borderLeftColor: SEV_COLORS[risk.severity] }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{SOURCE_ICONS[risk.sourceType] ?? '⚠️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-100">{risk.title}</p>
                    <StatusBadge label={risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} variant={risk.severity} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{risk.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold" style={{ color: SEV_COLORS[risk.severity] }}>
                    ₺{(Math.abs(risk.estimatedFinancialImpact) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-600">impact</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-lg bg-slate-800/60 p-2">
                  <p className="text-xs text-slate-500">Probability</p>
                  <p className="text-sm font-bold text-slate-200">{risk.probability}%</p>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-2">
                  <p className="text-xs text-slate-500">Timeline</p>
                  <p className="text-xs font-semibold text-slate-200">{risk.timeline}</p>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-2">
                  <p className="text-xs text-slate-500">Region</p>
                  <p className="text-xs font-semibold text-slate-200">{risk.region}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {risk.affectedCategories.map(c => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="space-y-4">
            <SectionCard title="Risk Detail">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-100">{selected.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge label={selected.severity.charAt(0).toUpperCase() + selected.severity.slice(1)} variant={selected.severity} />
                    <span className="text-xs text-slate-500">{selected.sourceType.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{selected.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {[
                    { label: 'Financial Impact',   value: `₺${Math.abs(selected.estimatedFinancialImpact).toLocaleString()}` },
                    { label: 'Probability',        value: `${selected.probability}%` },
                    { label: 'Timeline',           value: selected.timeline },
                    { label: 'Region',             value: selected.region },
                    { label: 'Affected Products',  value: `${selected.affectedProducts.length} products` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-semibold text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3">
                  <p className="text-xs font-semibold text-cyan-400 mb-1">Suggested Action</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{selected.suggestedAction}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Affected Products</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.affectedProducts.map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{p.split(' ').slice(0, 2).join(' ')}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Sources</p>
                  {selected.sources.map(s => (
                    <p key={s} className="text-xs text-slate-400">• {s}</p>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {/* Explainability + CTA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <ExplainabilityPanel
          title="Why These Supply Chain Risks?"
          reasons={[
            'Asian port delays (Shanghai/Shenzhen): 8–14 day shipping window affects 4 electronics products.',
            'Colombian coffee crop damage confirmed — raw material costs up 22%, affecting 3 SKUs.',
            'TRY/USD volatility at 18% annualized — raises import costs on all overseas goods.',
            'Port congestion correlates with 31% higher supply gap probability based on historical data.',
            'Electronics components from China account for 60% of high-risk inventory value.',
            'Forward contract window for coffee closes in 5 days — delay means full cost exposure.',
          ]}
        />
        <div className="flex justify-end items-end h-full">
          <button
            onClick={() => navigate('/ai-agent-console')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600
                       text-white text-sm font-semibold hover:from-orange-500 hover:to-red-500 transition-all shadow-lg">
            {t('riskMitigationPlan')}
          </button>
        </div>
      </div>

      {/* Impact chart */}
      <ChartCard title={t('impactByRisk')} description={t('impactDesc')}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 9 }} width={90} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
              formatter={v => [`₺${v.toLocaleString()}`, 'Est. Impact']} />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
