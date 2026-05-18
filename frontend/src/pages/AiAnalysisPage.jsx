import { useState, useEffect } from 'react';
import AiRecommendationPanel from '../components/AiRecommendationPanel.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner   from '../components/ErrorBanner.jsx';
import { fetchAlerts } from '../api/productApi.js';
import { analyzeProduct } from '../api/aiApi.js';

export default function AiAnalysisPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [isFallback, setIsFallback]     = useState(false);
  const [history, setHistory]     = useState([]); // local analysis history

  useEffect(() => {
    fetchAlerts()
      .then((res) => {
        const data = res.data.data;
        setProducts(data);
        // Auto-select highest risk product
        if (data.length > 0) setSelectedProduct(data[0]);
      })
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

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
        setAnalysis(res.data.data);
        setIsFallback(false);
        setHistory((prev) => [
          { product: selectedProduct.name, riskScore: selectedProduct.riskMetrics.score, analysis: res.data.data, isFallback: false, ts: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4),
        ]);
      } else if (res.data.fallback) {
        console.warn('[Gemini Fallback]', res.data.errorType, '—', res.data.message);
        setAnalysis(res.data.fallbackRecommendation);
        setIsFallback(true);
        setHistory((prev) => [
          { product: selectedProduct.name, riskScore: selectedProduct.riskMetrics.score, analysis: res.data.fallbackRecommendation, isFallback: true, ts: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4),
        ]);
      }
    } catch (err) {
      console.error('[Gemini] Unexpected error:', err.message);
      setAnalyzeError('Unable to reach the analysis service. Make sure the backend is running on port 5000.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading products…" />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {/* ── Product selector ──────────────────────────────────────── */}
      <div className="xl:col-span-1 space-y-3">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
          Select Product — sorted by risk
        </p>
        <div className="space-y-1.5 max-h-[calc(100vh-11rem)] overflow-y-auto custom-scrollbar pr-1">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className={`w-full text-left rounded-xl border p-3 transition-all duration-150 ${
                selectedProduct?.id === product.id
                  ? 'border-cyan-500/50 bg-slate-800 ring-1 ring-cyan-500/20'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{product.category}</span>
                <span className={`text-xs font-bold ${
                  product.riskMetrics.level === 'HIGH' ? 'text-red-400' :
                  product.riskMetrics.level === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
                }`}>
                  {product.riskMetrics.score}/100
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-snug pr-1">{product.name}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {product.riskMetrics.isStockoutRisk && (
                  <span className="text-xs px-1 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15">Stockout</span>
                )}
                {product.riskMetrics.isTrendOpportunity && (
                  <span className="text-xs px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">Trend ↑</span>
                )}
                {product.riskMetrics.isSalesDrop && (
                  <span className="text-xs px-1 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/15">Drop</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── AI panel ──────────────────────────────────────────────── */}
      <div className="xl:col-span-1">
        {selectedProduct ? (
          <AiRecommendationPanel
            product={selectedProduct}
            analysis={analysis}
            analyzing={analyzing}
            analyzeError={analyzeError}
            isFallback={isFallback}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 p-10
                          text-center flex flex-col items-center gap-3 h-full">
            <span className="text-4xl opacity-20">🤖</span>
            <p className="text-sm font-medium text-slate-500">Select a product</p>
          </div>
        )}
      </div>

      {/* ── Analysis history ──────────────────────────────────────── */}
      <div className="xl:col-span-1 space-y-3">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
          Session History
        </p>

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <p className="text-xs text-slate-600">No analyses yet this session.</p>
            <p className="text-xs text-slate-700 mt-1">Run Gemini on a product to see history here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-200 leading-snug pr-2">{item.product}</p>
                  <span className={`shrink-0 text-xs font-bold ${
                    item.riskScore >= 70 ? 'text-red-400' :
                    item.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                  }`}>{item.riskScore}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.isFallback ? (
                    <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">⚡ Fallback</span>
                  ) : (
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">🤖 Gemini</span>
                  )}
                  <span className="text-xs text-slate-600">{item.ts}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {item.analysis.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
