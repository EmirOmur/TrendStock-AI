const VARIANTS = {
  high:      'bg-red-500/15 text-red-400 border-red-500/25',
  medium:    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  low:       'bg-green-500/15 text-green-400 border-green-500/25',
  critical:  'bg-red-600/20 text-red-300 border-red-500/40',
  pending:   'bg-amber-500/15 text-amber-400 border-amber-500/25',
  accepted:  'bg-green-500/15 text-green-400 border-green-500/25',
  rejected:  'bg-slate-700/40 text-slate-500 border-slate-600/40',
  active:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  completed: 'bg-green-500/15 text-green-400 border-green-500/25',
  available: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  default:   'bg-slate-700/40 text-slate-400 border-slate-600/40',
};

export default function StatusBadge({ label, variant = 'default', className = '' }) {
  const cls = VARIANTS[variant] ?? VARIANTS.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls} ${className}`}>
      {label}
    </span>
  );
}
