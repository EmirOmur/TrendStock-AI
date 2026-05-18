import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard',      icon: '📊', label: 'Dashboard' },
  { path: '/products',       icon: '📦', label: 'Products' },
  { path: '/ai-analysis',    icon: '🤖', label: 'AI Analysis' },
  { path: '/trend-radar',    icon: '📡', label: 'Trend Radar' },
  { path: '/news-monitor',   icon: '📰', label: 'News Monitor' },
  { path: '/sales-forecast', icon: '📈', label: 'Sales Forecast' },
  { path: '/settings',       icon: '⚙️',  label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800">
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">📦</span>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-tight">TrendStock</p>
            <p className="text-xs text-cyan-400 font-medium">AI Dashboard</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`
            }
          >
            <span className="text-base leading-none w-5 text-center">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-500">Backend connected</span>
        </div>
        <p className="text-xs text-slate-700">v1.0.0 · Hackathon MVP</p>
      </div>
    </aside>
  );
}
