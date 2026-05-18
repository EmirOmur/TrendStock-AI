// AI Recommendation Panel — dark theme with Gemini fallback support.
//
// Props:
//   product       — selected product object (with riskMetrics)
//   analysis      — Gemini OR fallback recommendation object (same schema)
//   analyzing     — boolean, shows loading state
//   analyzeError  — friendly string error (never raw JSON), or null
//   isFallback    — true when showing deterministic fallback instead of Gemini
//   onAnalyze     — callback to trigger analysis

const CONFIDENCE_BADGE = {
  HIGH:   'text-green-400 bg-green-500/10 border-green-500/20',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  LOW:    'text-slate-400 bg-slate-700/40 border-slate-600/40',
};

export default function AiRecommendationPanel({
  product,
  analysis,
  analyzing,
  analyzeError,
  isFallback,
  onAnalyze,
}) {
  const rm = product.riskMetrics;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 flex flex-col">

      {/* ── Product header ───────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-base mt-0.5">🤖</span>
          <h3 className="text-sm font-semibold text-slate-100 leading-snug">{product.name}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span>{product.category}</span>
          <span className="text-slate-700">·</span>
          <span>${product.price}</span>
          <span className="text-slate-700">·</span>
          <span className={`font-bold ${
            rm.score >= 70 ? 'text-red-400' :
            rm.score >= 40 ? 'text-amber-400' : 'text-green-400'
          }`}>
            Risk {rm.score}/100
          </span>
        </div>
      </div>

      {/* ── Key metrics grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 border-b border-slate-800 divide-x divide-slate-800">
        <GridMetric
          label="Stock Days"
          value={`${rm.daysUntilStockout}d`}
          danger={rm.isStockoutRisk}
        />
        <GridMetric
          label="Sales 7d"
          value={`${product.salesChange7d > 0 ? '+' : ''}${product.salesChange7d}%`}
          danger={product.salesChange7d < -15}
          positive={product.salesChange7d > 0}
        />
        <GridMetric
          label="Trend"
          value={`${product.trendChange > 0 ? '+' : ''}${product.trendChange}%`}
          positive={product.trendChange > 30}
        />
      </div>
      <div className="grid grid-cols-3 border-b border-slate-800 divide-x divide-slate-800">
        <GridMetric
          label="Cmp. Price"
          value={`${product.competitorPriceChange > 0 ? '+' : ''}${product.competitorPriceChange}%`}
          danger={Math.abs(product.competitorPriceChange) > 5}
        />
        <GridMetric
          label="Margin"
          value={`${product.profitMargin}%`}
          danger={product.profitMargin < 20}
        />
        <GridMetric
          label="Lead Time"
          value={`${product.supplierLeadTimeDays}d`}
        />
      </div>

      {/* ── Analyze button ───────────────────────────────────────── */}
      <div className="p-4">
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="w-full py-2.5 px-4 bg-cyan-600 text-white rounded-lg text-sm font-semibold
                     hover:bg-cyan-500 active:bg-cyan-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <><Spinner /> Analyzing with Gemini...</>
          ) : (
            <><span>✨</span> Analyze with Gemini</>
          )}
        </button>

        {!analysis && !analyzing && !analyzeError && (
          <p className="text-xs text-slate-700 text-center mt-2">
            Gemini will explain risks and suggest actions
          </p>
        )}
      </div>

      {/* ── Friendly error — never raw JSON ─────────────────────── */}
      {analyzeError && (
        <div className="mx-4 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-xs text-red-400 leading-relaxed">{analyzeError}</p>
        </div>
      )}

      {/* ── Analysis output ──────────────────────────────────────── */}
      {analysis && (
        <div className="px-4 pb-4 space-y-3.5 overflow-y-auto custom-scrollbar max-h-[420px]">

          {/* Source badge */}
          {isFallback ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                            bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs">⚡</span>
              <span className="text-xs text-amber-400 font-semibold">Fallback Mode</span>
              <span className="text-xs text-amber-500/60">— Gemini quota reached</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                            bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-xs">🤖</span>
              <span className="text-xs text-cyan-400 font-semibold">Gemini Analysis</span>
            </div>
          )}

          {/* Summary */}
          <AiSection title="Summary" icon="📋">
            <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary}</p>
          </AiSection>

          {/* Risk explanation */}
          <AiSection title="Risk Explanation" icon="⚠️">
            <p className="text-xs text-slate-400 leading-relaxed">{analysis.riskExplanation}</p>
          </AiSection>

          {/* Recommended actions */}
          {analysis.recommendedActions?.length > 0 && (
            <AiSection title="Recommended Actions" icon="🎯">
              <div className="space-y-2">
                {analysis.recommendedActions.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-slate-800 border border-slate-700/60 p-2.5"
                  >
                    <p className="text-xs font-semibold text-cyan-300 mb-1">{item.action}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.reason}</p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      <span className="text-slate-500 font-medium">Impact: </span>
                      {item.expectedImpact}
                    </p>
                  </div>
                ))}
              </div>
            </AiSection>
          )}

          {/* Warnings */}
          {analysis.financialWarning && (
            <AiWarning icon="💰" label="Financial Warning" color="red">
              {analysis.financialWarning}
            </AiWarning>
          )}
          {analysis.supplyChainWarning && (
            <AiWarning icon="🚢" label="Supply Chain Warning" color="orange">
              {analysis.supplyChainWarning}
            </AiWarning>
          )}

          {/* Trend opportunity */}
          {analysis.trendOpportunity && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2.5">
              <p className="text-xs font-semibold text-green-400 mb-1">🌱 Trend Opportunity</p>
              <p className="text-xs text-green-300/80 leading-relaxed">
                {analysis.trendOpportunity}
              </p>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center justify-end pt-0.5">
            <span className="text-xs text-slate-600 mr-1.5">Confidence:</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                CONFIDENCE_BADGE[analysis.confidence] ?? CONFIDENCE_BADGE.MEDIUM
              }`}
            >
              {analysis.confidence}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function GridMetric({ label, value, danger, positive }) {
  return (
    <div className="p-2.5 text-center">
      <p className="text-xs text-slate-600 mb-0.5">{label}</p>
      <p className={`text-xs font-bold ${
        danger   ? 'text-red-400'  :
        positive ? 'text-cyan-400' :
                   'text-slate-300'
      }`}>
        {value}
      </p>
    </div>
  );
}

function AiSection({ title, icon, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}

function AiWarning({ icon, label, color, children }) {
  const styles = {
    red:    'bg-red-500/10 border-red-500/20 title-red label-red',
    orange: 'bg-orange-500/10 border-orange-500/20',
  };
  const titleColor = color === 'red' ? 'text-red-400' : 'text-orange-400';
  const bodyColor  = color === 'red' ? 'text-red-300/70' : 'text-orange-300/70';
  const bg         = color === 'red'
    ? 'bg-red-500/10 border-red-500/20'
    : 'bg-orange-500/10 border-orange-500/20';

  return (
    <div className={`rounded-lg border p-2.5 ${bg}`}>
      <p className={`text-xs font-semibold mb-1 ${titleColor}`}>{icon} {label}</p>
      <p className={`text-xs leading-relaxed ${bodyColor}`}>{children}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
