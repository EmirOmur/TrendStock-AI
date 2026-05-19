import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  ScatterChart, Scatter, LineChart, Line,
} from 'recharts';
import LoadingSpinner       from '../components/LoadingSpinner.jsx';
import ErrorBanner           from '../components/ErrorBanner.jsx';
import MetricCard            from '../components/MetricCard.jsx';
import SectionCard           from '../components/SectionCard.jsx';
import ChartCard             from '../components/ChartCard.jsx';
import StatusBadge           from '../components/StatusBadge.jsx';
import WhatIfSimulator       from '../components/WhatIfSimulator.jsx';
import ExplainabilityPanel   from '../components/ExplainabilityPanel.jsx';
import { useLanguage }       from '../context/LanguageContext.jsx';
import { getPricingRecommendations } from '../api/pricingApi.js';

const STATUS_VARIANT = { pending: 'pending', accepted: 'accepted', rejected: 'rejected' };

export default function DynamicPricingPage() {
  const { t }               = useLanguage();
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);
  const [selected, setSel]  = useState(null);
  const [statuses, setStatuses] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getPricingRecommendations()
      .then(r => {
        const d = r.data.data;
        setData(d);
        setSel(d.recommendations[0]);
        const st = {};
        d.recommendations.forEach(r => { st[r.id] = r.status; });
        setStatuses(st);
      })
      .catch(() => setError('Cannot reach backend.'))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading pricing data…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { recommendations, summary } = data;
  const filtered = filter === 'all' ? recommendations : recommendations.filter(r => {
    if (filter === 'increase') return r.priceChangePct > 0;
    if (filter === 'decrease') return r.priceChangePct < 0;
    return statuses[r.id] === filter;
  });

  function handleAction(id, action) {
    setStatuses(prev => ({ ...prev, [id]: action }));
  }

  const chartData = recommendations.map(r => ({
    name: r.productName.split(' ').slice(0, 2).join(' '),
    current: r.currentPrice,
    suggested: r.suggestedPrice,
    competitor: r.competitorAvgPrice,
  }));

  const impactData = recommendations.slice(0, 6).map(r => ({
    name: r.productName.split(' ').slice(0, 2).join(' '),
    impact: r.expectedRevenueImpact,
    change: r.priceChangePct,
  }));

  return (
    <div className="space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('priceRecommendations')} value={summary.total}       description={t('totalActiveSugg')}  color="cyan"  icon="💹" />
        <MetricCard title={t('increaseSuggestions')}  value={summary.increases}   description={t('priceUplift')}      color="green" icon="📈" />
        <MetricCard title={t('decreaseSuggestions')}  value={summary.decreases}   description={t('defensivePrice')}   color="amber" icon="📉" />
        <MetricCard title={t('totalRevenueImpact')}   value={`₺${(summary.totalRevenueImpact/1000).toFixed(0)}K`} description={t('ifAllAccepted')} color="green" icon="💰" />
      </div>

      {/* Core demo callout */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💹</span>
          <div>
            <p className="text-sm font-bold text-amber-300">Pricing Opportunity: +7% for SoundPulse Pro Wireless Earbuds</p>
            <p className="text-xs text-amber-400/80 mt-1">
              Current: ₺1,299 · Competitor avg: ₺1,349 · Suggested: ₺1,389 (+6.9%)
              · Expected revenue impact: +₺32,400/month · Confidence: 91%
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all',      label: t('filterAll') },
          { key: 'increase', label: t('filterIncrease') },
          { key: 'decrease', label: t('filterDecrease') },
          { key: 'pending',  label: t('filterPending') },
          { key: 'accepted', label: t('filterAccepted') },
          { key: 'rejected', label: t('filterRejected') },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === key ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recommendations list */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map(rec => {
            const status = statuses[rec.id] ?? rec.status;
            const isIncrease = rec.priceChangePct > 0;
            return (
              <div key={rec.id} onClick={() => setSel(rec)}
                className={`rounded-xl border bg-slate-900 p-4 cursor-pointer transition-all
                  ${selected?.id === rec.id ? 'border-cyan-500/30 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{rec.productName}</p>
                    <p className="text-xs text-slate-500">{rec.category} · Confidence: {rec.confidence}%</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-bold ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                      {isIncrease ? '+' : ''}{rec.priceChangePct.toFixed(1)}%
                    </span>
                    <StatusBadge label={status} variant={STATUS_VARIANT[status] ?? 'default'} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    { label: 'Current', value: `₺${rec.currentPrice.toLocaleString()}`, color: 'text-slate-300' },
                    { label: 'Competitor', value: `₺${rec.competitorAvgPrice.toLocaleString()}`, color: 'text-slate-400' },
                    { label: 'Suggested', value: `₺${rec.suggestedPrice.toLocaleString()}`, color: isIncrease ? 'text-green-400' : 'text-red-400' },
                    { label: 'Revenue Impact', value: `+₺${rec.expectedRevenueImpact.toLocaleString()}`, color: 'text-cyan-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center rounded-lg bg-slate-800/60 p-2">
                      <p className={`text-sm font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{rec.reasoning}</p>

                {status === 'pending' && (
                  <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleAction(rec.id, 'accepted')}
                      className="flex-1 py-1.5 rounded-lg bg-green-600/80 hover:bg-green-600 text-white text-xs font-semibold transition-colors">
                      {t('acceptPrice')}
                    </button>
                    <button onClick={() => handleAction(rec.id, 'pending')}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors">
                      {t('simulate')}
                    </button>
                    <button onClick={() => handleAction(rec.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors">
                      {t('reject')}
                    </button>
                  </div>
                )}
                {status === 'accepted' && (
                  <p className="text-xs text-green-400 mt-2 font-medium">{t('priceUpdateAccepted')}</p>
                )}
                {status === 'rejected' && (
                  <p className="text-xs text-slate-500 mt-2">{t('priceRejected')}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail + AI panel */}
        {selected && (
          <div className="space-y-4">
            <SectionCard title={t('pricingAnalysis')}>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-100">{selected.productName}</p>
                  <p className="text-xs text-slate-500">{selected.category}</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Current Price',     value: `₺${selected.currentPrice.toLocaleString()}` },
                    { label: 'Competitor Avg',    value: `₺${selected.competitorAvgPrice.toLocaleString()}` },
                    { label: 'Suggested Price',   value: `₺${selected.suggestedPrice.toLocaleString()}`, highlight: true },
                    { label: 'Price Change',      value: `${selected.priceChangePct > 0 ? '+' : ''}${selected.priceChangePct.toFixed(1)}%`, highlight: true },
                    { label: 'Margin Change',     value: `${selected.expectedMarginChange > 0 ? '+' : ''}${selected.expectedMarginChange}pp` },
                    { label: 'Revenue Impact',    value: `+₺${selected.expectedRevenueImpact.toLocaleString()}` },
                    { label: 'Currency Impact',   value: `${selected.currencyImpactPct}%` },
                    { label: 'Market Volatility', value: `${selected.marketVolatilityPct}%` },
                    { label: 'Confidence',        value: `${selected.confidence}%` },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className={`text-xs font-semibold ${highlight ? 'text-cyan-400' : 'text-slate-300'}`}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3">
                  <p className="text-xs font-semibold text-purple-400 mb-1">AI Reasoning</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{selected.reasoning}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {/* What-If Simulator + Explainability */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <WhatIfSimulator />
        <ExplainabilityPanel
          title="Why the +7% Earbuds Recommendation?"
          reasons={[
            'Competitor average price is ₺1,349 — your ₺1,299 is 3.7% below market.',
            'Demand elasticity model shows <5% sales drop at +7% price.',
            'TikTok trend score 87/100 signals high purchase intent despite price increase.',
            'Earbuds already have 4.8★ rating — premium pricing is justified by quality signals.',
            'Simulated revenue impact: +₺32,400/month at 91% model confidence.',
            'Competitor sell-through rate is 78%, indicating strong market demand.',
          ]}
        />
      </div>

      {/* Primary CTA */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const first = Object.keys(statuses).find(id => statuses[id] === 'pending' || statuses[id] === undefined);
            if (first) setStatuses(prev => ({ ...prev, [first]: 'accepted' }));
          }}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600
                     text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg">
          {t('simulatePriceImpact')}
        </button>
      </div>

      {/* Price comparison chart */}
      <ChartCard title="Current vs Suggested vs Competitor Price" description="Per-product price comparison">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₺${v.toLocaleString()}`} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
              formatter={v => `₺${v.toLocaleString()}`} />
            <Bar dataKey="current" name="Current Price" fill="#475569" radius={[3, 3, 0, 0]} />
            <Bar dataKey="competitor" name="Competitor Avg" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="suggested" name="AI Suggested" fill="#06b6d4" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
