// Relative time helper — no external library needed
function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diffMs / 3_600_000);
  const d = Math.floor(diffMs / 86_400_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

const RISK_BADGE = {
  HIGH:   'bg-red-500/15 text-red-400 border-red-500/25',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  LOW:    'bg-green-500/15 text-green-400 border-green-500/25',
};

const SENTIMENT_ICON = { NEGATIVE: '🔴', POSITIVE: '🟢', NEUTRAL: '⚪️' };

export default function NewsMonitor({ news }) {
  if (!news || news.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4
                      flex items-center justify-center h-40">
        <p className="text-sm text-slate-600">No market news loaded</p>
      </div>
    );
  }

  // Sort HIGH risk first
  const sorted = [...news].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return (order[a.riskLevel] ?? 3) - (order[b.riskLevel] ?? 3);
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          📰 Market Intelligence
        </h3>
        <span className="text-xs text-slate-600">{news.length} items</span>
      </div>

      <div className="space-y-2.5 overflow-y-auto custom-scrollbar max-h-72 pr-0.5">
        {sorted.map((item) => {
          const badge = RISK_BADGE[item.riskLevel] ?? RISK_BADGE.MEDIUM;

          return (
            <div
              key={item.id}
              className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3"
            >
              {/* Title + risk badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-slate-200 leading-snug flex-1">
                  {item.title}
                </p>
                <span className={`flex-shrink-0 text-xs font-medium px-1.5 py-0.5 rounded border ${badge}`}>
                  {item.riskLevel}
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <span className="text-xs text-slate-500">{item.source}</span>
                <span className="text-slate-700 text-xs">·</span>
                <span className="text-xs text-slate-600">{timeAgo(item.publishedAt)}</span>
                <span className="text-xs">{SENTIMENT_ICON[item.sentiment]}</span>
              </div>

              {/* Affected categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {item.affectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-1.5 py-0.5 rounded bg-slate-700/60
                               text-slate-400 border border-slate-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-500 leading-relaxed mb-2">{item.summary}</p>

              {/* Suggested action */}
              <div className="border-t border-slate-700/50 pt-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyan-400 font-medium">Action: </span>
                  {item.suggestedAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
