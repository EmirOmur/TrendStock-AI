import { useLanguage } from '../context/LanguageContext.jsx';

export default function ErrorBanner({ message, onRetry }) {
  const { t } = useLanguage();

  const isGemini  = message && (message.includes('quota') || message.includes('RESOURCE_EXHAUSTED') || message.includes('429') || message.includes('Gemini'));
  const isBackend = message && (message.includes('backend') || message.includes('ECONNREFUSED') || message.includes('Network') || message.includes('Backend') || message.includes('5001'));

  const title   = isGemini  ? t('errorGeminiTitle')
                : isBackend ? t('errorBackendTitle')
                : t('errorGenericTitle');

  const friendly = isGemini  ? t('errorGeminiMsg')
                 : isBackend ? t('errorBackendMsg')
                 : t('errorGenericMsg');

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 mx-auto max-w-xl mt-8">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5 shrink-0">{isGemini ? '🤖' : '⚠️'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-300">{title}</p>
          <p className="text-xs text-red-300/70 mt-1 leading-relaxed">{friendly}</p>
          {isBackend && (
            <div className="mt-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-400">
              cd backend &amp;&amp; npm run dev
            </div>
          )}
          {onRetry && (
            <button onClick={onRetry}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300
                         hover:bg-slate-700 hover:text-slate-100 transition-colors">
              ↻ {t('retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
