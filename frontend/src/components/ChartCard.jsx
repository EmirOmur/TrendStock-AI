export default function ChartCard({ title, description, children, className = '', action }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between px-4 py-3 border-b border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-200">{title}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
