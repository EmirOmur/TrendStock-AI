const COLOR_MAP = {
  red: 'border-red-400 bg-red-50 text-red-600',
  amber: 'border-amber-400 bg-amber-50 text-amber-600',
  green: 'border-green-400 bg-green-50 text-green-600',
  blue: 'border-blue-400 bg-blue-50 text-blue-600',
};

export default function MetricCard({ title, value, description, color = 'blue' }) {
  return (
    <div className={`rounded-xl border-l-4 p-5 shadow-sm bg-white ${COLOR_MAP[color]?.split(' ')[0] ?? 'border-blue-400'}`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${COLOR_MAP[color]?.split(' ')[2] ?? 'text-blue-600'}`}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}
