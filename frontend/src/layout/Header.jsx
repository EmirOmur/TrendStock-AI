import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '/dashboard':      { title: 'Dashboard',       description: 'Executive risk intelligence overview',        badge: 'Live',       badgeColor: 'cyan' },
  '/products':       { title: 'Products',         description: 'Monitor and filter all 18 products',          badge: 'Mock Data',  badgeColor: 'blue' },
  '/ai-analysis':    { title: 'AI Analysis',      description: 'Gemini-powered product risk analysis',        badge: 'Gemini',     badgeColor: 'purple' },
  '/trend-radar':    { title: 'Trend Radar',      description: 'Real-time market signal monitoring',          badge: '12 Signals', badgeColor: 'amber' },
  '/news-monitor':   { title: 'News Monitor',     description: 'Market intelligence and supply chain news',   badge: '12 Items',   badgeColor: 'green' },
  '/sales-forecast': { title: 'Sales Forecast',   description: 'Predicted vs actual sales with risk scoring', badge: '8 Products', badgeColor: 'amber' },
  '/settings':       { title: 'Settings',         description: 'Configure integrations and preferences',       badge: 'Config',     badgeColor: 'slate' },
};

const BADGE_COLORS = {
  cyan:   'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  green:  'text-green-400 bg-green-500/10 border-green-500/20',
  slate:  'text-slate-400 bg-slate-700/40 border-slate-600/40',
};

export default function Header() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? PAGE_META['/dashboard'];
  const badgeClass = BADGE_COLORS[meta.badgeColor] ?? BADGE_COLORS.slate;

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5
                       border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-100">{meta.title}</h1>
        <span className={`hidden sm:inline-flex text-xs font-medium px-2 py-0.5
                          rounded-full border ${badgeClass}`}>
          {meta.badge}
        </span>
        <span className="hidden md:block text-xs text-slate-600">·</span>
        <p className="hidden md:block text-xs text-slate-500">{meta.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 hidden sm:block">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="h-7 w-7 rounded-full bg-cyan-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">AI</span>
        </div>
      </div>
    </header>
  );
}
