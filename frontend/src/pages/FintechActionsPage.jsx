import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import LoadingSpinner      from '../components/LoadingSpinner.jsx';
import ErrorBanner         from '../components/ErrorBanner.jsx';
import MetricCard          from '../components/MetricCard.jsx';
import FinanceOfferCard    from '../components/FinanceOfferCard.jsx';
import ChartCard           from '../components/ChartCard.jsx';
import WhatIfSimulator     from '../components/WhatIfSimulator.jsx';
import ExplainabilityPanel from '../components/ExplainabilityPanel.jsx';
import { useLanguage }     from '../context/LanguageContext.jsx';
import { getFintechOffers } from '../api/fintechApi.js';

const TYPE_FILTERS = [
  { key: 'all',               label: 'All Offers' },
  { key: 'micro_credit',      label: 'Micro-Credit' },
  { key: 'inventory_financing', label: 'Inventory Finance' },
  { key: 'campaign_budget',   label: 'Campaign Budget' },
  { key: 'supplier_payment',  label: 'Supplier Payment' },
  { key: 'working_capital',   label: 'Working Capital' },
];

const PIE_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];

export default function FintechActionsPage() {
  const { t }              = useLanguage();
  const [data, setData]    = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState(null);
  const [typeFilter, setType] = useState('all');
  const [urgencyFilter, setUrgency] = useState('all');

  useEffect(() => {
    getFintechOffers()
      .then(r => setData(r.data.data))
      .catch(() => setError('Cannot reach backend.'))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading fintech offers…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { offers, summary } = data;

  const filtered = offers.filter(o =>
    (typeFilter === 'all' || o.type === typeFilter) &&
    (urgencyFilter === 'all' || o.urgency === urgencyFilter)
  );

  const roiSimData = [
    { month: 'May', roi: 0 },
    { month: 'Jun', roi: 8 },
    { month: 'Jul', roi: 16 },
    { month: 'Aug', roi: 24 },
    { month: 'Sep', roi: 24 },
    { month: 'Oct', roi: 24 },
  ];

  const byTypeData = Object.entries(summary.byType)
    .filter(([, v]) => v > 0)
    .map(([k, v], i) => ({
      name: TYPE_FILTERS.find(f => f.key === k)?.label ?? k,
      value: v,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

  const offerBars = offers.slice(0, 6).map(o => ({
    name: o.title.split(' ').slice(0, 2).join(' '),
    amount: o.amount,
    roi: o.estimatedROI,
  }));

  return (
    <div className="space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('activeOffers')}      value={summary.total}     description={t('availableNow')}    color="cyan"  icon="💳" />
        <MetricCard title={t('availableCapital')}  value={`₺${(summary.totalAvailableCapital/1000).toFixed(0)}K`} description={t('totalFinPool')} color="green" icon="💰" />
        <MetricCard title={t('avgEstimatedROI')}   value={`${summary.avgROI}%`} description={t('acrossAllOffers')} color="green" icon="📈" />
        <MetricCard title={t('highUrgency')}       value={summary.highUrgency}  description={t('actWithin7days')}  color="red"   icon="⚡" />
      </div>

      {/* Hero offer callout */}
      <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-950/50 via-slate-900 to-emerald-950/30 p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-xl">💳</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">
              {t('primaryFinRec')}
            </p>
            <h2 className="text-lg font-bold text-slate-100">₺85,000 Short-Term Micro-Credit</h2>
            <p className="text-sm text-slate-300 mt-1">
              For SoundPulse Pro Wireless Earbuds · 3-month term · 2.1%/month · <span className="text-green-400 font-semibold">24% estimated ROI</span>
            </p>
            <p className="text-xs text-slate-400 mt-2 max-w-xl">
              Demand expected to surge +42% in 14 days. Current stock (72 units) will run out in 6 days.
              This credit offer covers 450-unit restock (₺85,050) and enables a 7% price increase simultaneously.
            </p>
          </div>
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-2xl font-bold text-green-400">24%</p>
            <p className="text-xs text-slate-500">Expected ROI</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
            {t('noCollateral')}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
            {t('sameDayApproval')}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
            {t('linkedToInventory')}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
            ⚠ Expires 2026-05-26
          </span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <ChartCard title={t('roiSimulation')} description={t('earbudsMicroCredit')} className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={roiSimData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                formatter={v => [`${v}%`, 'Cumulative ROI']}
              />
              <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('offersByType')} description={t('offerDistrib')}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byTypeData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${value}`}>
                {byTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {byTypeData.map((d, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setType(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              typeFilter === key ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
        <div className="w-px h-7 bg-slate-700 self-center" />
        {['all', 'high', 'medium', 'low'].map(u => (
          <button key={u} onClick={() => setUrgency(u)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              urgencyFilter === u ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {u === 'all' ? 'All Urgency' : u.charAt(0).toUpperCase() + u.slice(1)}
          </button>
        ))}
      </div>

      {/* Offers grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(offer => (
          <FinanceOfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {/* What-If Simulator + Explainability */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <WhatIfSimulator />
        <ExplainabilityPanel
          title="Why This Financing Offer?"
          reasons={[
            'Stock will run out in 6 days — 4 days before supplier can deliver 450 units.',
            'Demand is forecast to surge +42% in the next 14 days based on trend signals.',
            'The ₺85,000 micro-credit covers the full reorder cost with no collateral needed.',
            'At 2.1%/month interest, the financing cost is ₺5,355 over 3 months.',
            'Simulated net profit after costs and financing: +₺42,300 (24% ROI).',
            'Historical data shows earbuds sell through 78% faster during trend peaks.',
          ]}
        />
      </div>

      {/* Primary CTA */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600
                     text-white text-sm font-semibold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg">
          {t('compareOffers')}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="text-xs text-slate-600 text-center">{t('fintechDisclaimer')}</p>
      </div>
    </div>
  );
}
