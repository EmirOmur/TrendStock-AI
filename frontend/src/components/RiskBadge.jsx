const STYLES = {
  HIGH:   'bg-red-500/15 text-red-400 border-red-500/25',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  LOW:    'bg-green-500/15 text-green-400 border-green-500/25',
};

export default function RiskBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
        STYLES[level] ?? STYLES.LOW
      }`}
    >
      {level}
    </span>
  );
}
