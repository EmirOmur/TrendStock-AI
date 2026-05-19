import { NavLink }       from 'react-router-dom';
import { useLanguage }   from '../context/LanguageContext.jsx';

const NAV_ITEMS = [
  { path: '/dashboard',         icon: '⚡',  labelKey: 'dashboard'      },
  { path: '/products',          icon: '📦',  labelKey: 'products'       },
  { path: '/trend-radar',       icon: '📡',  labelKey: 'trendRadar'     },
  { path: '/news-monitor',      icon: '📰',  labelKey: 'newsMonitor'    },
  { path: '/inventory',         icon: '🗄️',  labelKey: 'inventory'      },
  { path: '/dynamic-pricing',   icon: '💹',  labelKey: 'dynamicPricing' },
  { path: '/fintech-actions',   icon: '💳',  labelKey: 'fintechActions' },
  { path: '/supply-chain',      icon: '🚢',  labelKey: 'supplyChain'    },
  { path: '/ai-agent-console',  icon: '🤖',  labelKey: 'aiAgentConsole' },
  { path: '/reports',           icon: '📊',  labelKey: 'reports'        },
  { path: '/settings',          icon: '⚙️',   labelKey: 'settings'       },
];

export default function Sidebar() {
  const { t } = useLanguage();

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white">TS</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-tight">TrendStock AI</p>
            <p className="text-xs text-cyan-400 font-medium">E-Commerce Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
              }`
            }
          >
            <span className="text-base leading-none w-5 text-center shrink-0">{icon}</span>
            <span className="truncate">{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-500">{t('backendConnected')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span className="text-xs text-slate-500">Gemini 2.0 Flash</span>
        </div>
        <p className="text-xs text-slate-700">v2.0.0 · Hackathon MVP</p>
      </div>
    </aside>
  );
}
