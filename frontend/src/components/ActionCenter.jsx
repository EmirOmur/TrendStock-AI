import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage }  from '../context/LanguageContext.jsx';

const PRIORITY_STYLE = {
  Critical: { badge: 'bg-red-500/20 text-red-300 border-red-500/30',   dot: 'bg-red-400',   border: 'border-l-red-500' },
  High:     { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400', border: 'border-l-amber-500' },
  Medium:   { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   dot: 'bg-blue-400',  border: 'border-l-blue-500' },
  Low:      { badge: 'bg-slate-700/60 text-slate-400 border-slate-600/40', dot: 'bg-slate-500', border: 'border-l-slate-600' },
};

const CAT_ICON = {
  Finance:        '💳',
  Inventory:      '📦',
  Pricing:        '💹',
  Marketing:      '📣',
  'Supply Chain': '🚢',
};

export default function ActionCenter({ actions = [], showAll = false }) {
  const navigate = useNavigate();
  const { t }    = useLanguage();
  const [statuses, setStatuses] = useState({});
  const [expanded, setExpanded] = useState(showAll);
  const [simulated, setSimulated] = useState({});

  function markDone(id) { setStatuses(s => ({ ...s, [id]: 'Done' })); }
  function simulateImpact(id) {
    setSimulated(s => ({ ...s, [id]: true }));
    setTimeout(() => setSimulated(s => ({ ...s, [id]: false })), 2500);
  }

  const visible      = expanded ? actions : actions.slice(0, 5);
  const pendingCount = actions.filter(a => (statuses[a.id] ?? a.status) === 'Pending').length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-semibold text-slate-100">{t('actionCenter')}</span>
          {pendingCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/20 font-medium">
              {pendingCount} {t('pendingBadge')}
            </span>
          )}
        </div>
        {actions.length > 5 && (
          <button onClick={() => setExpanded(e => !e)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            {expanded ? t('showLess') : `${t('showAll')} ${actions.length}`}
          </button>
        )}
      </div>

      {visible.map(action => {
        const pStyle = PRIORITY_STYLE[action.priority] ?? PRIORITY_STYLE.Low;
        const status = statuses[action.id] ?? action.status;
        const isDone = status === 'Done';
        const isSim  = simulated[action.id];

        return (
          <div key={action.id}
            className={`rounded-xl border border-slate-800 border-l-4 ${pStyle.border} bg-slate-900/80
              p-3 transition-all ${isDone ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2.5">
              <span className="text-lg shrink-0 mt-0.5">{CAT_ICON[action.category] ?? '📌'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {action.title}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${pStyle.badge}`}>
                    {action.priority}
                  </span>
                  <span className="text-xs text-slate-600">{action.category}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{action.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-green-400 font-medium">{action.expectedImpact}</span>
                  <span className="text-xs text-slate-600">· Due {action.deadline}</span>
                </div>
                {isSim && (
                  <div className="mt-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/20 px-2 py-1">
                    <p className="text-xs text-cyan-300">{action.expectedImpact} — projected over 30 days (mock estimate)</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!isDone && (
                  <>
                    <button onClick={() => simulateImpact(action.id)}
                      className="px-2 py-1 rounded text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors">
                      {t('simulateImpact')}
                    </button>
                    <button onClick={() => navigate(action.relatedPage)}
                      className="px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
                      {t('viewDetails')}
                    </button>
                    <button onClick={() => markDone(action.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-500/20
                                 hover:bg-green-600/30 transition-colors font-medium">
                      {t('markAsDone')}
                    </button>
                  </>
                )}
                {isDone && <span className="text-xs text-green-400 font-medium">{t('checkMark')}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
