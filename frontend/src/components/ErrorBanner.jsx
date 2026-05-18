export default function ErrorBanner({ message }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 mx-auto max-w-lg mt-10">
      <div className="flex items-start gap-3">
        <span className="text-red-400 text-xl mt-0.5">⚠️</span>
        <div>
          <p className="text-red-400 font-semibold text-sm">Connection Error</p>
          <p className="text-red-300/70 text-xs mt-1 leading-relaxed">{message}</p>
          <div className="mt-3 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 font-mono text-xs text-slate-400">
            cd backend &amp;&amp; npm run dev
          </div>
        </div>
      </div>
    </div>
  );
}
