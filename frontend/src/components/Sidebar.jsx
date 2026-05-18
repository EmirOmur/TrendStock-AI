const NAV_ITEMS = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard'    },
  { id: 'products',     icon: '📦', label: 'Products'     },
  { id: 'ai-analysis',  icon: '🤖', label: 'AI Analysis'  },
  { id: 'trend-radar',  icon: '📡', label: 'Trend Radar'  },
  { id: 'news-monitor', icon: '📰', label: 'News Monitor' },
];

const BOTTOM_ITEMS = [
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">

      {/* ── Brand ─────────────────────────────────────────────────── */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600
                          flex items-center justify-center text-xs font-bold text-white shadow-lg">
            TS
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-100 leading-none tracking-tight truncate">
              TrendStock AI
            </p>
            <p className="text-xs text-cyan-400 mt-0.5 truncate">
              Gemini-powered intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ── Main nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activePage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* ── Bottom nav ────────────────────────────────────────────── */}
      <div className="px-3 py-2 border-t border-slate-800 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activePage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      {/* ── Status footer ─────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-xs text-slate-500">Gemini Connected</span>
        </div>
        <p className="text-xs text-slate-700 ml-3.5">6 products · 5 news items</p>
        <p className="text-xs text-slate-800 ml-3.5 mt-0.5">Hackathon MVP · v1.0</p>
      </div>
    </aside>
  );
}

function NavButton({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                  transition-all duration-150 text-left group ${
        active
          ? 'bg-slate-800 text-cyan-400'
          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      <span className="text-sm leading-none flex-shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
      )}
    </button>
  );
}
