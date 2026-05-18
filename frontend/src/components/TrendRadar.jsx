const OPPORTUNITY_BADGE = {
  HIGH:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  MEDIUM: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  LOW:    'bg-slate-500/15 text-slate-400 border-slate-600/40',
};

const SIGNAL_ICON = {
  SEARCH_SURGE:    '🔍',
  TREND_DIVERGENCE:'⚡',
  GROWING_INTEREST:'📈',
  SOCIAL_SPIKE:    '🔥',
  SEASONAL_SURGE:  '🌿',
  STABLE_GROWTH:   '↗️',
};

export default function TrendRadar({ signals }) {
  if (!signals || signals.length === 0) {
    return (
      <EmptyState message="No trend signals loaded" />
    );
  }

  // Sort by trend change descending
  const sorted = [...signals].sort((a, b) => b.trendChange - a.trendChange);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col">
      <SectionHeader title="📡 Trend Radar" count={signals.length} unit="signals" />

      <div className="space-y-2.5 overflow-y-auto custom-scrollbar max-h-72 pr-0.5 mt-3">
        {sorted.map((signal) => {
          const oppBadge = OPPORTUNITY_BADGE[signal.opportunityLevel] ?? OPPORTUNITY_BADGE.MEDIUM;
          const icon = SIGNAL_ICON[signal.signalType] ?? '📊';
          const positive = signal.trendChange > 0;

          return (
            <div
              key={signal.id}
              className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3"
            >
              {/* Top row: keyword + trend % */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm flex-shrink-0">{icon}</span>
                  <p className="text-xs font-semibold text-slate-200 leading-snug truncate">
                    {signal.keyword}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
                  {positive ? '+' : ''}{signal.trendChange}%
                </span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400 border border-slate-700">
                  {signal.category}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded border ${oppBadge}`}>
                  {signal.opportunityLevel}
                </span>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-500 leading-relaxed">{signal.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({ title, count, unit }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</h3>
      <span className="text-xs text-slate-600">{count} {unit}</span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4
                    flex items-center justify-center h-40">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
