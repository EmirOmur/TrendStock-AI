import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext.jsx';

const DEFAULTS = {
  priceIncrease:    7,
  reorderQty:       450,
  financingAmount:  85000,
  campaignBudget:   15000,
};

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

function buildProjection(params) {
  const { priceIncrease, reorderQty, financingAmount, campaignBudget } = params;
  const basePrice        = 1299;
  const newPrice         = basePrice * (1 + priceIncrease / 100);
  const unitCost         = 189;
  const demandMultiplier = 1 + 0.42 * (reorderQty / 450);
  const projectedUnits   = Math.round(12 * 30 * demandMultiplier * (campaignBudget > 5000 ? 1.15 : 1));
  const grossRevenue     = projectedUnits * newPrice;
  const cogs             = reorderQty * unitCost;
  const financingCost    = financingAmount * 0.021 * 3;
  const netProfit        = grossRevenue - cogs - campaignBudget - financingCost;
  const roi              = financingAmount > 0 ? ((netProfit - financingAmount) / financingAmount) * 100 : 0;
  const stockoutRisk     = reorderQty >= 200 ? 'Low' : reorderQty >= 100 ? 'Medium' : 'High';
  const payback          = netProfit > 0 ? Math.ceil(financingAmount / (netProfit / 3)) : 'N/A';
  const months = ['Jun', 'Jul', 'Aug'];
  const curve = months.map((m, i) => ({
    month: m,
    revenue: Math.round(grossRevenue * [0.28, 0.38, 0.34][i]),
    profit:  Math.round(netProfit   * [0.22, 0.42, 0.36][i]),
  }));
  return {
    projectedRevenue: Math.round(grossRevenue),
    netProfit:        Math.round(netProfit),
    roi:              Math.round(roi * 10) / 10,
    stockoutRisk,
    paybackMonths:    payback,
    newPrice:         Math.round(newPrice),
    projectedUnits,
    curve,
  };
}

export default function WhatIfSimulator({ compact = false }) {
  const [params, setParams] = useState(DEFAULTS);
  const { t }               = useLanguage();
  const result = useMemo(() => buildProjection(params), [params]);

  function set(key, val) { setParams(p => ({ ...p, [key]: Number(val) })); }

  const controls = [
    { key: 'priceIncrease',   labelKey: 'priceIncrease',   unit: '%',  min: 0,  max: 20,     step: 1 },
    { key: 'reorderQty',      labelKey: 'reorderQtyLabel', unit: 'u',  min: 0,  max: 800,    step: 50 },
    { key: 'financingAmount', labelKey: 'financingLabel',  unit: '₺K', min: 0,  max: 200000, step: 5000, div: 1000 },
    { key: 'campaignBudget',  labelKey: 'campaignBudget',  unit: '₺K', min: 0,  max: 50000,  step: 2500, div: 1000 },
  ];

  const riskColor = { Low: 'text-green-400', Medium: 'text-amber-400', High: 'text-red-400' };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/15 overflow-hidden">
      <div className="px-4 py-3 border-b border-cyan-500/15 bg-gradient-to-r from-cyan-950/40 to-slate-900">
        <div className="flex items-center gap-2">
          <span className="text-base">🔮</span>
          <p className="text-sm font-semibold text-cyan-300">{t('whatIfSimulator')}</p>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
            {t('mockEstimate')}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{t('adjustLevers')}</p>
      </div>

      <div className={`p-4 ${compact ? 'space-y-3' : 'space-y-4'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {controls.map(({ key, labelKey, unit, min, max, step, div }) => {
            const display = div ? (params[key] / div).toFixed(0) + unit : params[key] + unit;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 font-medium">{t(labelKey)}</label>
                  <span className="text-xs font-bold text-cyan-300">{display}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={params[key]}
                  onChange={e => set(key, e.target.value)}
                  className="w-full h-1.5 rounded-full accent-cyan-500 cursor-pointer" />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { labelKey: 'revenueImpact', value: `₺${(result.projectedRevenue / 1000).toFixed(0)}K`, color: 'text-cyan-400' },
            { labelKey: 'estROI',        value: `${result.roi}%`,                                   color: result.roi >= 15 ? 'text-green-400' : result.roi >= 0 ? 'text-amber-400' : 'text-red-400' },
            { labelKey: 'stockoutRiskLabel', value: result.stockoutRisk,                            color: riskColor[result.stockoutRisk] ?? 'text-slate-400' },
            { labelKey: 'payback',       value: typeof result.paybackMonths === 'number' ? `${result.paybackMonths}mo` : 'N/A', color: 'text-slate-200' },
          ].map(({ labelKey, value, color }) => (
            <div key={labelKey} className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-center">
              <p className={`text-base font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{t(labelKey)}</p>
            </div>
          ))}
        </div>

        {!compact && (
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={result.curve}>
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 9 }} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} width={36} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                formatter={v => `₺${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="profit"  name="Profit"  stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        <p className="text-xs text-center text-slate-600">{t('simulatedEstimates')}</p>
      </div>
    </div>
  );
}
