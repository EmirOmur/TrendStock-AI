import { useNavigate } from 'react-router-dom';
import RiskBadge       from './RiskBadge.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

function calcRiskScore(p) {
  let score = 0;
  const days = p._daysUntilStockout ?? p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales);
  if (days < p.supplierLeadTimeDays) score += 30;
  if (p.salesChange7d < -15) score += 25;
  if (Math.abs(p.competitorPriceChange) > 5) score += 15;
  if (p.trendChange > 30 && p.salesChange7d < 0) score += 20;
  if (p.profitMargin < 20) score += 10;
  return Math.min(score, 100);
}

function healthScore(p) {
  let s = 100;
  const days = p._daysUntilStockout ?? p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales);
  if (days < p.supplierLeadTimeDays) s -= 30;
  if (p.salesChange7d < -15) s -= 20;
  if (Math.abs(p.competitorPriceChange) > 5) s -= 10;
  if (p.profitMargin < 20) s -= 10;
  if (p.trendChange >= 30) s += 10;
  if (p.rating >= 4.5) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

const RELATED_NEWS = [
  'Wireless earbuds trending on TikTok (+71% mentions)',
  'Google Trends score: 87/100 (up from 61)',
  'Competitor sell-through rate: 78%',
];

export default function ProductDetailDrawer({ product, onClose }) {
  const navigate   = useNavigate();
  const { t }      = useLanguage();
  if (!product) return null;

  const days   = product._daysUntilStockout ?? product.daysUntilStockout ?? Math.round(product.currentStock / product.avgDailySales);
  const risk   = product._riskLevel ?? (days < product.supplierLeadTimeDays ? 'HIGH' : days < product.supplierLeadTimeDays * 1.5 ? 'MEDIUM' : 'LOW');
  const health = healthScore(product);
  const score  = product._riskScore ?? calcRiskScore(product);

  const healthColor = health >= 70 ? 'text-green-400' : health >= 40 ? 'text-amber-400' : 'text-red-400';
  const healthBg    = health >= 70 ? 'bg-green-500' : health >= 40 ? 'bg-amber-500' : 'bg-red-500';

  const isEarbuds = product.id === 'prod_101';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl
                      flex flex-col overflow-y-auto animate-[slideIn_0.2s_ease-out]">

        <div className="flex items-start justify-between p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 backdrop-blur-sm">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-100 leading-tight truncate">{product.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{product.category} · {product.supplierCountry}</p>
          </div>
          <button onClick={onClose}
            className="shrink-0 ml-2 h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center
                       text-slate-400 hover:text-slate-100 text-xs transition-colors">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('riskScore')}</p>
              <p className={`text-2xl font-bold ${risk === 'HIGH' ? 'text-red-400' : risk === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'}`}>
                {score}
              </p>
              <RiskBadge level={risk} />
            </div>
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('healthScore')}</p>
              <p className={`text-2xl font-bold ${healthColor}`}>{health}</p>
              <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div className={`h-full rounded-full ${healthBg}`} style={{ width: `${health}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 divide-y divide-slate-800">
            {[
              { label: t('currentPrice'),      value: `₺${product.price.toLocaleString()}` },
              { label: t('currentStock'),      value: `${product.currentStock} units` },
              { label: t('daysUntilStockout'), value: `${days} days`, highlight: days < 10 },
              { label: t('salesChange7d'),     value: `${product.salesChange7d > 0 ? '+' : ''}${product.salesChange7d}%`, highlight: product.salesChange7d < -10 },
              { label: t('trendChange'),       value: `+${product.trendChange}%`, highlight: product.trendChange >= 30 },
              { label: t('competitorAvg'),     value: product.competitorAvgPrice ? `₺${product.competitorAvgPrice.toLocaleString()}` : '—' },
              { label: t('suggestedPrice'),    value: product.competitorAvgPrice ? `₺${Math.round(product.price * 1.07).toLocaleString()}` : '—', highlight: true },
              { label: t('financingNeeded'),   value: product.financingNeeded ? `₺${product.financingNeeded.toLocaleString()}` : '—' },
              { label: t('expectedROILabel'),  value: product.expectedROI ? `${product.expectedROI}%` : '—', highlight: (product.expectedROI ?? 0) >= 20 },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between items-center px-3 py-2">
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`text-xs font-semibold ${highlight ? 'text-cyan-400' : 'text-slate-200'}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-300 mb-1">{t('recommendedNextAction')}</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {risk === 'HIGH' && isEarbuds
                ? 'Apply for ₺85,000 micro-credit and place 450-unit reorder within 24 hours. Also apply +7% price increase today.'
                : risk === 'HIGH'
                ? `Reorder ${product.recommendedReorderQty ?? 'stock'} units and review supplier lead time. Consider financing if needed.`
                : risk === 'MEDIUM'
                ? 'Monitor closely and prepare reorder plan for next 7 days.'
                : 'No immediate action needed. Continue monitoring trend signals.'}
            </p>
          </div>

          {isEarbuds && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-slate-400 mb-2">{t('relatedTrendSignals')}</p>
              {RELATED_NEWS.map((n, i) => (
                <p key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                  <span className="text-cyan-500 shrink-0">•</span>{n}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2 sticky bottom-0 bg-slate-900">
          <button onClick={() => { navigate('/ai-agent-console'); onClose(); }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600
                       text-white text-xs font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all">
            {t('viewFullAiPlan')}
          </button>
          <button onClick={() => { navigate('/fintech-actions'); onClose(); }}
            className="w-full py-2.5 rounded-lg border border-green-500/30 bg-green-500/10
                       text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
            {t('seeFinancingOptions')}
          </button>
        </div>
      </div>
    </>
  );
}
