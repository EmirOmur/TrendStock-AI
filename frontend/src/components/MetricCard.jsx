// Color system: border accent + value text
const COLOR = {
  red:   { border: 'border-red-500',   value: 'text-red-400'   },
  amber: { border: 'border-amber-500', value: 'text-amber-400' },
  cyan:  { border: 'border-cyan-500',  value: 'text-cyan-400'  },
  green: { border: 'border-green-500', value: 'text-green-400' },
  blue:  { border: 'border-blue-500',  value: 'text-blue-400'  },
};

export default function MetricCard({ title, value, description, color = 'blue', icon }) {
  const c = COLOR[color] ?? COLOR.blue;

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-4
                  border-l-4 ${c.border} transition-colors`}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-medium text-slate-500 leading-snug">{title}</p>
        {icon && <span className="text-base leading-none opacity-60">{icon}</span>}
      </div>
      <p className={`text-2xl font-bold leading-none mb-1 ${c.value}`}>{value}</p>
      {description && (
        <p className="text-xs text-slate-600 truncate">{description}</p>
      )}
    </div>
  );
}
