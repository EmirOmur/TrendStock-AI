import { useState, useEffect } from 'react';
import { useNavigate }    from 'react-router-dom';
import LoadingSpinner     from '../components/LoadingSpinner.jsx';
import ErrorBanner        from '../components/ErrorBanner.jsx';
import MetricCard         from '../components/MetricCard.jsx';
import AgentLogCard       from '../components/AgentLogCard.jsx';
import SectionCard        from '../components/SectionCard.jsx';
import { useLanguage }    from '../context/LanguageContext.jsx';
import { getAgentLogs }   from '../api/agentApi.js';

const AGENT_COLORS = {
  trend_hunter:        'from-cyan-500 to-blue-600',
  inventory_planner:   'from-blue-500 to-indigo-600',
  pricing_optimizer:   'from-amber-500 to-orange-600',
  finance_analyst:     'from-green-500 to-emerald-600',
  supply_chain_watcher:'from-orange-500 to-red-600',
  executive_decision:  'from-purple-500 to-pink-600',
};

const AGENT_ICONS = {
  radar: '📡', boxes: '📦', tag: '💹', chart: '📊', ship: '🚢', crown: '👑',
};

export default function AiAgentConsolePage() {
  const navigate              = useNavigate();
  const { t }                 = useLanguage();
  const [data, setData]       = useState(null);
  const [loading, setLoad]    = useState(true);
  const [error, setError]     = useState(null);
  const [agentFilter, setAF]  = useState('all');
  const [prioFilter, setPF]   = useState('all');

  useEffect(() => {
    getAgentLogs()
      .then(r => setData(r.data.data))
      .catch(() => setError('Cannot reach backend.'))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading agent console…" />;
  if (error)   return <ErrorBanner message={error} />;

  const { logs, agents, executiveSummary, summary } = data;

  const filtered = logs.filter(l =>
    (agentFilter === 'all' || l.agentId === agentFilter) &&
    (prioFilter === 'all' || l.priority === prioFilter)
  );

  return (
    <div className="space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={t('activeAgents')}    value={summary.agentsActive}    description={t('parallelReasoning')}    color="purple" icon="🤖" />
        <MetricCard title={t('criticalActions')} value={summary.criticalActions} description={t('requireImmediateAttn')} color="red"    icon="🚨" />
        <MetricCard title={t('highPriority')}    value={summary.highActions}     description={t('actWithin24h')}         color="amber"  icon="⚡" />
        <MetricCard title={t('avgConfidence')}   value={`${summary.avgConfidence}%`} description={t('acrossAllRecs')}    color="cyan"   icon="🎯" />
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/30 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0">
              <span className="text-xl">👑</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">{t('execDecisionAgent')}</p>
              <p className="text-base font-bold text-slate-100 mt-0.5">{executiveSummary.linkedProduct}</p>
            </div>
            <span className="ml-auto text-sm font-bold text-purple-300 shrink-0">{executiveSummary.confidence}% confidence</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed mb-4">{executiveSummary.message}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {executiveSummary.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-900/60 px-3 py-2">
                <span className={`text-xs font-bold shrink-0 ${
                  d.includes('CRITICAL') || d.includes('ACTION 1') || d.includes('ACTION 2') ? 'text-red-400' :
                  d.includes('HIGH') || d.includes('ACTION 3') ? 'text-amber-400' :
                  d.includes('Expected') ? 'text-green-400' : 'text-slate-500'
                }`}>▸</span>
                <span className="text-xs text-slate-300">{d}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-purple-900/30 border border-purple-500/20">
            <p className="text-xs font-semibold text-purple-300">Recommendation</p>
            <p className="text-xs text-slate-300 mt-1">{executiveSummary.recommendation}</p>
          </div>
        </div>
      )}

      {/* Agent status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {agents.map(agent => {
          const gradientCls = AGENT_COLORS[agent.id] ?? 'from-slate-600 to-slate-700';
          const icon = AGENT_ICONS[agent.icon] ?? '🤖';
          const agentLogs = logs.filter(l => l.agentId === agent.id);
          const hasCritical = agentLogs.some(l => l.priority === 'critical');
          return (
            <button key={agent.id} onClick={() => setAF(agentFilter === agent.id ? 'all' : agent.id)}
              className={`rounded-xl border p-3 text-center transition-all ${
                agentFilter === agent.id ? 'border-cyan-500/30 bg-slate-800' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradientCls} flex items-center justify-center mx-auto mb-2 relative`}>
                <span className="text-xl">{icon}</span>
                {hasCritical && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-slate-900" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-tight">{agent.name.replace(' Agent', '')}</p>
              <p className="text-xs text-slate-600 mt-0.5">{agentLogs.length} log{agentLogs.length !== 1 ? 's' : ''}</p>
              <div className="mt-1.5">
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                  Active
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Priority filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'critical', 'high', 'medium', 'low'].map(p => (
          <button key={p} onClick={() => setPF(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              prioFilter === p ? 'bg-purple-500/15 text-purple-400 border border-purple-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {p === 'all' ? t('allPriority') : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <div className="w-px h-7 bg-slate-700 self-center" />
        <button onClick={() => { setAF('all'); setPF('all'); }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200">
          {t('clearFilters')}
        </button>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-600">
            {t('noLogsMatch')}
          </div>
        )}
        {filtered.map(log => (
          <AgentLogCard key={log.id} log={log} />
        ))}
      </div>

      {/* Primary CTA */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/reports')}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-violet-700
                     text-white text-sm font-semibold hover:from-purple-500 hover:to-violet-600 transition-all shadow-lg">
          {t('generateExecPlan')}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="text-xs text-slate-600 text-center">
          {t('agentDisclaimer')}
        </p>
      </div>
    </div>
  );
}
