import { useState, useEffect } from 'react';
import MetricCard from './MetricCard.jsx';
import ProductCard from './ProductCard.jsx';
import AiRecommendationPanel from './AiRecommendationPanel.jsx';
import SalesChart from './SalesChart.jsx';
import TrendPanel from './TrendPanel.jsx';
import TrendRadar from './TrendRadar.jsx';
import NewsMonitor from './NewsMonitor.jsx';
import { analyzeProduct } from '../api/aiApi.js';
import { fetchNews } from '../api/newsApi.js';
import { fetchMarketSignals } from '../api/marketSignalApi.js';

export default function Dashboard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis]               = useState(null);
  const [analyzing, setAnalyzing]             = useState(false);
  const [analyzeError, setAnalyzeError]       = useState(null);
  const [isFallback, setIsFallback]           = useState(false);
  const [news, setNews]                       = useState([]);
  const [marketSignals, setMarketSignals]     = useState([]);

  // Fetch news + trend signals on mount (fail silently — they're supplementary)
  useEffect(() => {
    fetchNews()
      .then((res) => setNews(res.data.data))
      .catch((err) => console.warn('[Dashboard] News fetch failed:', err.message));
    fetchMarketSignals()
      .then((res) => setMarketSignals(res.data.data))
      .catch((err) => console.warn('[Dashboard] Market signals fetch failed:', err.message));
  }, []);

  // ── Aggregate metrics ─────────────────────────────────────────────────────
  const highRiskCount = products.filter((p) => p.riskMetrics?.level === 'HIGH').length;
  const stockoutCount = products.filter((p) => p.riskMetrics?.isStockoutRisk).length;
  const trendCount    = products.filter((p) => p.riskMetrics?.isTrendOpportunity).length;
  const revenueAtRisk = products
    .filter((p) => p.riskMetrics?.level === 'HIGH')
    .reduce((sum, p) => {
      const decline = Math.abs(Math.min(p.salesChange7d, 0)) / 100;
      return sum + p.price * p.avgDailySales * 7 * decline;
    }, 0);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setAnalysis(null);
    setAnalyzeError(null);
    setIsFallback(false);
  };

  const handleAnalyze = async () => {
    if (!selectedProduct) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setIsFallback(false);

    try {
      const res = await analyzeProduct(selectedProduct, selectedProduct.riskMetrics);

      if (res.data.success) {
        // ✅ Gemini succeeded
        setAnalysis(res.data.data);
        setIsFallback(false);
      } else if (res.data.fallback) {
        // ⚡ Quota / error — backend generated deterministic fallback
        // Log Gemini error to console only — never show raw error in UI
        console.warn('[Gemini Fallback]', res.data.errorType, '—', res.data.message);
        setAnalysis(res.data.fallbackRecommendation);
        setIsFallback(true);
      }
    } catch (err) {
      // Network / unexpected error — also never show raw error in UI
      console.error('[Gemini] Unexpected error:', err.message);
      setAnalyzeError(
        'Unable to reach the analysis service. Make sure the backend is running on port 5000.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Metric cards row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          title="High Risk Products"
          value={highRiskCount}
          description={`of ${products.length} monitored`}
          color="red"
          icon="🔴"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`$${revenueAtRisk.toFixed(0)}`}
          description="7-day HIGH risk estimate"
          color="amber"
          icon="💸"
        />
        <MetricCard
          title="Trend Opportunities"
          value={trendCount}
          description="Rising search trends"
          color="cyan"
          icon="📈"
        />
        <MetricCard
          title="Stockout Alerts"
          value={stockoutCount}
          description="Stock < lead time"
          color="red"
          icon="⚠️"
        />
      </div>

      {/* ── Main grid: product list + right panel ─────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Products */}
        <div className="xl:col-span-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
            Products — sorted by risk score
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelect={handleSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* Right: AI panel + product context */}
        <div className="flex flex-col gap-4">
          {selectedProduct ? (
            <>
              <AiRecommendationPanel
                product={selectedProduct}
                analysis={analysis}
                analyzing={analyzing}
                analyzeError={analyzeError}
                isFallback={isFallback}
                onAnalyze={handleAnalyze}
              />
              <TrendPanel product={selectedProduct} />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-10
                            text-center flex flex-col items-center gap-3">
              <span className="text-4xl opacity-20">📦</span>
              <p className="text-sm font-medium text-slate-500">Select a product</p>
              <p className="text-xs text-slate-700">
                Click any product card to view details and run Gemini analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Lower section: chart + trend radar + news ─────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <SalesChart
          data={selectedProduct?.salesHistory}
          title={selectedProduct ? `${selectedProduct.name} — 14d Sales` : 'Sales Chart'}
        />
        <TrendRadar signals={marketSignals} />
        <NewsMonitor news={news} />
      </div>
    </div>
  );
}
