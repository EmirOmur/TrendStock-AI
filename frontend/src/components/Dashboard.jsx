import { useState } from 'react';
import MetricCard from './MetricCard.jsx';
import ProductCard from './ProductCard.jsx';
import AiRecommendationPanel from './AiRecommendationPanel.jsx';
import SalesChart from './SalesChart.jsx';
import TrendPanel from './TrendPanel.jsx';
import { analyzeProduct } from '../api/aiApi.js';

export default function Dashboard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  // ─── Aggregate metrics ────────────────────────────────────────────────────
  const highRiskCount = products.filter((p) => p.riskMetrics?.level === 'HIGH').length;
  const stockoutCount = products.filter((p) => p.riskMetrics?.isStockoutRisk).length;
  const trendCount = products.filter((p) => p.riskMetrics?.isTrendOpportunity).length;

  // Revenue at risk: 7-day projected revenue for HIGH risk products, weighted by sales decline
  const revenueAtRisk = products
    .filter((p) => p.riskMetrics?.level === 'HIGH')
    .reduce((sum, p) => {
      const declineFactor = Math.abs(Math.min(p.salesChange7d, 0)) / 100;
      return sum + p.price * p.avgDailySales * 7 * declineFactor;
    }, 0);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setAnalysis(null);
    setAnalyzeError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedProduct) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await analyzeProduct(selectedProduct, selectedProduct.riskMetrics);
      setAnalysis(res.data.data);
    } catch (err) {
      setAnalyzeError(
        err.response?.data?.error ?? 'Failed to get Gemini analysis. Check your API key and try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="High Risk Products"
          value={highRiskCount}
          description={`${products.length} total products`}
          color="red"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`$${revenueAtRisk.toFixed(0)}`}
          description="7-day projection (HIGH risk)"
          color="amber"
        />
        <MetricCard
          title="Trend Opportunities"
          value={trendCount}
          description="Products with rising search trends"
          color="green"
        />
        <MetricCard
          title="Stockout Alerts"
          value={stockoutCount}
          description="Stock < supplier lead time"
          color="red"
        />
      </div>

      {/* Main content: product grid + right panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left / center: product grid */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Products — sorted by risk
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Right: analysis panel */}
        <div className="flex flex-col gap-4">
          {selectedProduct ? (
            <>
              <AiRecommendationPanel
                product={selectedProduct}
                analysis={analysis}
                analyzing={analyzing}
                onAnalyze={handleAnalyze}
              />
              {analyzeError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {analyzeError}
                </div>
              )}
              <SalesChart
                data={selectedProduct.salesHistory}
                title={`${selectedProduct.name} — Sales (14d)`}
              />
              <TrendPanel product={selectedProduct} />
            </>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400 flex flex-col items-center gap-2">
              <span className="text-3xl">📦</span>
              <p className="text-sm font-medium">Select a product</p>
              <p className="text-xs">Click any product card to view details and run a Gemini analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
