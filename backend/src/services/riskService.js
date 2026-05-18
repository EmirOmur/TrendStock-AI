// Deterministic risk scoring engine.
// No AI involved — scores are reproducible and auditable.
// Gemini uses these results to explain risks, not to calculate them.

const THRESHOLDS = {
  salesDropPercent: -15,      // salesChange7d below this → SALES_DROP
  competitorPriceChange: 5,   // |competitorPriceChange| above this → PRICE_PRESSURE
  trendChangeMin: 30,         // trendChange above this → possible TREND_DIVERGENCE
  profitMarginMin: 20,        // profitMargin below this → LOW_MARGIN
};

const POINTS = {
  SALES_DROP: 25,
  STOCKOUT_RISK: 30,
  PRICE_PRESSURE: 15,
  TREND_SALES_DIVERGENCE: 20,
  LOW_MARGIN: 10,
};

/**
 * Calculates a comprehensive risk profile for a single product.
 * @param {Object} product - A product object from mockProducts
 * @returns {Object} riskMetrics - Score, level, flags, and contributing factors
 */
export function calculateRiskMetrics(product) {
  const daysUntilStockout = product.currentStock / product.avgDailySales;

  let score = 0;
  const factors = [];

  // --- SALES DROP ---
  if (product.salesChange7d < THRESHOLDS.salesDropPercent) {
    score += POINTS.SALES_DROP;
    factors.push({
      type: 'SALES_DROP',
      points: POINTS.SALES_DROP,
      detail: `Sales dropped ${product.salesChange7d}% in the last 7 days (threshold: ${THRESHOLDS.salesDropPercent}%)`,
    });
  }

  // --- STOCKOUT RISK ---
  if (daysUntilStockout < product.supplierLeadTimeDays) {
    score += POINTS.STOCKOUT_RISK;
    factors.push({
      type: 'STOCKOUT_RISK',
      points: POINTS.STOCKOUT_RISK,
      detail: `Only ${daysUntilStockout.toFixed(1)} days of stock remaining; supplier lead time is ${product.supplierLeadTimeDays} days`,
    });
  }

  // --- PRICE PRESSURE ---
  if (Math.abs(product.competitorPriceChange) > THRESHOLDS.competitorPriceChange) {
    score += POINTS.PRICE_PRESSURE;
    factors.push({
      type: 'PRICE_PRESSURE',
      points: POINTS.PRICE_PRESSURE,
      detail: `Competitor price shifted by ${product.competitorPriceChange}% (threshold: ±${THRESHOLDS.competitorPriceChange}%)`,
    });
  }

  // --- TREND-SALES DIVERGENCE ---
  // Trend is rising but sales are falling → visibility or pricing problem
  if (product.trendChange > THRESHOLDS.trendChangeMin && product.salesChange7d < 0) {
    score += POINTS.TREND_SALES_DIVERGENCE;
    factors.push({
      type: 'TREND_SALES_DIVERGENCE',
      points: POINTS.TREND_SALES_DIVERGENCE,
      detail: `Search trend is up ${product.trendChange}% but sales are declining — likely a pricing or visibility issue`,
    });
  }

  // --- LOW MARGIN ---
  if (product.profitMargin < THRESHOLDS.profitMarginMin) {
    score += POINTS.LOW_MARGIN;
    factors.push({
      type: 'LOW_MARGIN',
      points: POINTS.LOW_MARGIN,
      detail: `Profit margin is ${product.profitMargin}%, below the ${THRESHOLDS.profitMarginMin}% healthy threshold`,
    });
  }

  // Cap at 100
  score = Math.min(score, 100);

  return {
    score,
    level: getRiskLevel(score),
    daysUntilStockout: parseFloat(daysUntilStockout.toFixed(1)),
    factors,
    isStockoutRisk: daysUntilStockout < product.supplierLeadTimeDays,
    isSalesDrop: product.salesChange7d < THRESHOLDS.salesDropPercent,
    isTrendOpportunity: product.trendChange > THRESHOLDS.trendChangeMin,
    isPricePressure: Math.abs(product.competitorPriceChange) > THRESHOLDS.competitorPriceChange,
  };
}

/**
 * Maps a numeric risk score to a human-readable level.
 * @param {number} score
 * @returns {'LOW' | 'MEDIUM' | 'HIGH'}
 */
export function getRiskLevel(score) {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}
