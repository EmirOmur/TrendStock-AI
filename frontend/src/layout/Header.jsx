import { useLocation } from 'react-router-dom';
import NotificationCenter from '../components/NotificationCenter.jsx';
import { useLanguage }    from '../context/LanguageContext.jsx';

const PAGE_META = {
  '/dashboard':        { titleKey: 'dashboard',      descKey: 'dashboardDesc',      badge: 'Live Demo',    badgeColor: 'cyan' },
  '/products':         { titleKey: 'products',        descKey: 'productsDesc',        badge: 'Mock Data',    badgeColor: 'blue' },
  '/trend-radar':      { titleKey: 'trendRadar',      descKey: 'trendRadarDesc',      badge: '12 Signals',   badgeColor: 'amber' },
  '/news-monitor':     { titleKey: 'newsMonitor',     descKey: 'newsMonitorDesc',     badge: 'Live Feed',    badgeColor: 'green' },
  '/inventory':        { titleKey: 'inventory',       descKey: 'inventoryDesc',       badge: 'AI Powered',   badgeColor: 'purple' },
  '/dynamic-pricing':  { titleKey: 'dynamicPricing',  descKey: 'dynamicPricingDesc',  badge: 'Gemini',       badgeColor: 'purple' },
  '/fintech-actions':  { titleKey: 'fintechActions',  descKey: 'fintechActionsDesc',  badge: 'Mock Finance', badgeColor: 'green' },
  '/supply-chain':     { titleKey: 'supplyChain',     descKey: 'supplyChainDesc',     badge: '8 Risks',      badgeColor: 'red' },
  '/ai-agent-console': { titleKey: 'aiAgentConsole',  descKey: 'aiAgentConsoleDesc',  badge: '6 Agents',     badgeColor: 'purple' },
  '/reports':          { titleKey: 'reports',         descKey: 'reportsDesc',         badge: 'Week 20',      badgeColor: 'cyan' },
  '/settings':         { titleKey: 'settings',        descKey: 'settingsDesc',        badge: 'Config',       badgeColor: 'slate' },
  '/ai-analysis':      { titleKey: 'dashboard',       descKey: 'aiAnalysisDesc',      badge: 'Gemini',       badgeColor: 'purple' },
  '/sales-forecast':   { titleKey: 'dashboard',       descKey: 'salesForecastDesc',   badge: '8 Products',   badgeColor: 'amber' },
};

const BADGE_COLORS = {
  cyan:   'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  green:  'text-green-400 bg-green-500/10 border-green-500/20',
  red:    'text-red-400 bg-red-500/10 border-red-500/20',
  slate:  'text-slate-400 bg-slate-700/40 border-slate-600/40',
};

export default function Header() {
  const { pathname }             = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const meta       = PAGE_META[pathname] ?? PAGE_META['/dashboard'];
  const badgeClass = BADGE_COLORS[meta.badgeColor] ?? BADGE_COLORS.slate;

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5
                       border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-100">{t(meta.titleKey)}</h1>
        <span className={`hidden sm:inline-flex text-xs font-medium px-2 py-0.5
                          rounded-full border ${badgeClass}`}>
          {meta.badge}
        </span>
        <span className="hidden lg:block text-xs text-slate-700">·</span>
        <p className="hidden lg:block text-xs text-slate-500 truncate max-w-xs">{t(meta.descKey)}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* EN / TR switcher */}
        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
              language === 'en'
                ? 'bg-cyan-500/20 text-cyan-300 border-r border-slate-700'
                : 'text-slate-500 hover:text-slate-300 border-r border-slate-700'
            }`}>
            EN
          </button>
          <button
            onClick={() => setLanguage('tr')}
            className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
              language === 'tr'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}>
            TR
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-400 font-medium">{t('geminiReady')}</span>
        </div>
        <span className="text-xs text-slate-600 hidden sm:block">
          {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <NotificationCenter />
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">AI</span>
        </div>
      </div>
    </header>
  );
}
