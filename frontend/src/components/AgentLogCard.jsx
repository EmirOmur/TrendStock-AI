import StatusBadge from './StatusBadge.jsx';

const AGENT_COLORS = {
  trend_hunter:        'from-cyan-500 to-blue-600',
  inventory_planner:   'from-blue-500 to-indigo-600',
  pricing_optimizer:   'from-amber-500 to-orange-600',
  finance_analyst:     'from-green-500 to-emerald-600',
  supply_chain_watcher:'from-orange-500 to-red-600',
  executive_decision:  'from-purple-500 to-pink-600',
};

const AGENT_ICONS = {
  radar: '📡',
  boxes: '📦',
  tag:   '💹',
  chart: '📊',
  ship:  '🚢',
  crown: '👑',
};

const PRIORITY_COLORS = {
  critical: 'border-l-red-500',
  high:     'border-l-amber-500',
  medium:   'border-l-blue-500',
  low:      'border-l-slate-600',
};

export default function AgentLogCard({ log, expanded = false }) {
  const gradientCls = AGENT_COLORS[log.agentId] ?? 'from-slate-600 to-slate-700';
  const borderCls   = PRIORITY_COLORS[log.priority] ?? 'border-l-slate-600';
  const icon        = AGENT_ICONS[log.agentIcon] ?? '🤖';

  return (
    <div className={`rounded-xl border border-slate-800 border-l-4 ${borderCls} bg-slate-900 p-4 space-y-3
      ${log.isExecutiveSummary ? 'ring-1 ring-purple-500/30 bg-purple-950/20' : ''}`}>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${gradientCls} flex items-center justify-center shrink-0`}>
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-100">{log.agentName}</p>
            {log.isExecutiveSummary && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                Executive Summary
              </span>
            )}
            <StatusBadge label={log.priority} variant={log.priority === 'critical' ? 'critical' : log.priority === 'high' ? 'high' : log.priority === 'medium' ? 'medium' : 'default'} />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            {log.linkedProduct && (
              <span className="text-xs text-cyan-400">→ {log.linkedProduct}</span>
            )}
            {!log.linkedProduct && log.linkedCategory && (
              <span className="text-xs text-slate-400">Category: {log.linkedCategory}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-slate-200">{log.confidence}%</p>
          <p className="text-xs text-slate-600">confidence</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-slate-300 leading-relaxed">{log.message}</p>

      {/* Details */}
      {log.details && log.details.length > 0 && (
        <ul className="space-y-1">
          {log.details.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-slate-600 shrink-0 mt-0.5">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Recommendation */}
      {log.recommendation && (
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-2">
          <p className="text-xs font-semibold text-cyan-400 mb-0.5">Recommendation</p>
          <p className="text-xs text-slate-300">{log.recommendation}</p>
        </div>
      )}
    </div>
  );
}
