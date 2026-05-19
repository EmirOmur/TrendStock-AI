import { useLanguage } from '../context/LanguageContext.jsx';

const DEFAULT_REASONS = [
  'Demand is expected to increase by +42% in the next 14 days based on social media signals and search trend data.',
  'Current stock (72 units) covers only 6 days at current sales velocity — below the 10-day supplier lead time.',
  'Without restocking action, an estimated ₺89,000 in demand will be missed during the peak window.',
  'Competitor prices (avg ₺1,349) are ₺50 above current price, allowing a controlled 7% increase to ₺1,389.',
  '₺85,000 financing covers 450-unit restock at supplier cost and bridges the cash flow gap.',
  'Expected ROI is 24% after financing costs — positive even under conservative demand assumptions.',
];

export default function ExplainabilityPanel({
  title   = null,
  product = 'SoundPulse Pro Wireless Earbuds',
  reasons = DEFAULT_REASONS,
  compact = false,
}) {
  const { t } = useLanguage();
  const displayTitle = title ?? t('whyThisRecommendation');

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center shrink-0">
          <span className="text-xs">🧠</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-300">{displayTitle}</p>
          {product && <p className="text-xs text-slate-500">{product}</p>}
        </div>
      </div>

      <ul className={`space-y-${compact ? '1' : '2'}`}>
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-purple-400 shrink-0 text-xs mt-0.5 font-bold">{i + 1}.</span>
            <span className="text-xs text-slate-300 leading-relaxed">{reason}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 pt-1 border-t border-purple-500/10">
        <span className="text-xs">🔒</span>
        <p className="text-xs text-slate-500 italic">{t('trustBadge')}</p>
      </div>
    </div>
  );
}
