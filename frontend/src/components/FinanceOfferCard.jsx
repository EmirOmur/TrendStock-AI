import { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';

const TYPE_LABELS = {
  micro_credit:       'Micro-Credit',
  inventory_financing:'Inventory Finance',
  campaign_budget:    'Campaign Budget',
  supplier_payment:   'Supplier Payment',
  working_capital:    'Working Capital',
};

const URGENCY_COLOR = {
  high:   'border-l-red-500',
  medium: 'border-l-amber-500',
  low:    'border-l-green-500',
};

export default function FinanceOfferCard({ offer }) {
  const [btnState, setBtnState] = useState('idle');

  function handleApprove() {
    setBtnState('approving');
    setTimeout(() => setBtnState('approved'), 1200);
  }

  const urgencyBorder = URGENCY_COLOR[offer.urgency] ?? 'border-l-slate-600';

  return (
    <div className={`rounded-xl border border-slate-800 border-l-4 ${urgencyBorder} bg-slate-900 p-4 space-y-3`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[offer.type] ?? offer.type}
            </span>
            <span className="text-xs text-slate-600">{offer.providerBadge}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100 mt-1.5">{offer.title}</h3>
          <p className="text-xs text-slate-400">{offer.subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold text-green-400">
            ₺{offer.amount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">{offer.termMonths}m · {offer.monthlyRate}%/mo</p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-800/60 p-2.5 text-center">
          <p className="text-lg font-bold text-green-400">{offer.estimatedROI}%</p>
          <p className="text-xs text-slate-500">Est. ROI</p>
        </div>
        <div className="rounded-lg bg-slate-800/60 p-2.5 text-center">
          <p className="text-lg font-bold text-blue-400">{offer.confidence}%</p>
          <p className="text-xs text-slate-500">Confidence</p>
        </div>
        <div className="rounded-lg bg-slate-800/60 p-2.5 text-center">
          <StatusBadge label={offer.riskLevel.charAt(0).toUpperCase() + offer.riskLevel.slice(1)}
            variant={offer.riskLevel} />
          <p className="text-xs text-slate-500 mt-0.5">Risk</p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-slate-400 leading-relaxed">{offer.reason}</p>

      {/* Use + impact */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="text-xs text-cyan-400 font-medium shrink-0">Use:</span>
          <span className="text-xs text-slate-300">{offer.suggestedUse}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-green-400 font-medium shrink-0">Impact:</span>
          <span className="text-xs text-slate-300">{offer.expectedImpact}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {offer.features.map((f, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {f}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {btnState === 'approved' ? (
          <div className="flex-1 text-center py-2 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-medium">
            ✓ Financing Approved (Demo)
          </div>
        ) : (
          <>
            <button
              onClick={handleApprove}
              disabled={btnState === 'approving'}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600
                         text-white text-xs font-semibold hover:from-green-500 hover:to-emerald-500
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnState === 'approving' ? 'Processing…' : 'Approve Financing'}
            </button>
            <button className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400
                               hover:text-slate-200 hover:border-slate-600 text-xs font-medium transition-colors">
              Compare
            </button>
            <button className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400
                               hover:text-slate-200 hover:border-slate-600 text-xs font-medium transition-colors">
              Simulate
            </button>
          </>
        )}
      </div>
      {btnState !== 'approved' && (
        <p className="text-xs text-center text-slate-700">
          This is a simulated demo offer. No real financial transaction occurs.
        </p>
      )}
    </div>
  );
}
