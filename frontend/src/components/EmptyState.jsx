export default function EmptyState({ icon = '📭', title = 'No data found', message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-4xl mb-4 opacity-60">{icon}</span>
      <p className="text-sm font-semibold text-slate-300 mb-1">{title}</p>
      {message && <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{message}</p>}
      {action && onAction && (
        <button onClick={onAction}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium
                     text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}
