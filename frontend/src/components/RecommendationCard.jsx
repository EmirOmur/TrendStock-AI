export default function RecommendationCard({ title, items, icon = '💡', color = 'cyan' }) {
  const borderMap = { cyan: 'border-l-cyan-500', green: 'border-l-green-500', purple: 'border-l-purple-500', amber: 'border-l-amber-500', red: 'border-l-red-500' };
  const textMap   = { cyan: 'text-cyan-400', green: 'text-green-400', purple: 'text-purple-400', amber: 'text-amber-400', red: 'text-red-400' };

  return (
    <div className={`rounded-xl border border-slate-800 border-l-4 ${borderMap[color] ?? borderMap.cyan} bg-slate-900 p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <p className={`text-sm font-semibold ${textMap[color] ?? textMap.cyan}`}>{title}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-slate-600 shrink-0 mt-0.5 text-xs">▸</span>
            <span className="text-xs text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
