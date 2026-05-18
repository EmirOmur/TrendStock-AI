const PAGE_TITLES = {
  dashboard:     'Dashboard',
  products:      'Products',
  'ai-analysis': 'AI Analysis',
  'trend-radar': 'Trend Radar',
  'news-monitor':'News Monitor',
  settings:      'Settings',
};

export default function Header({ activePage, productCount = 6 }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="h-13 flex-shrink-0 bg-slate-900 border-b border-slate-800
                       flex items-center justify-between px-5 py-0" style={{ height: '52px' }}>

      {/* Left: page title + live badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-slate-200">
          {PAGE_TITLES[activePage] ?? 'Dashboard'}
        </h1>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full
                         bg-green-500/10 border border-green-500/20 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Right: date + model badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 hidden sm:block">{dateStr} · {timeStr}</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                        bg-slate-800 border border-slate-700/60">
          <span className="text-xs">🤖</span>
          <span className="text-xs text-slate-300 font-medium">Gemini 2.0 Flash</span>
        </div>
      </div>
    </header>
  );
}
