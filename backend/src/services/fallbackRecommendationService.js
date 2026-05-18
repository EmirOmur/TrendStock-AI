/**
 * Generates a deterministic fallback recommendation from risk metrics + product data.
 * Called when Gemini is unavailable (quota exceeded, rate limited, network error, etc.).
 *
 * Output schema is identical to the Gemini response so the frontend
 * renders it the same way — only the "Fallback Mode" badge differs.
 */
export function generateFallbackRecommendation(product, riskMetrics) {
  const actions = [];
  let financialWarning = null;
  let supplyChainWarning = null;
  let trendOpportunity = null;

  // ── 1. Stockout risk → emergency reorder ────────────────────────────────
  if (riskMetrics.isStockoutRisk) {
    const gap = product.supplierLeadTimeDays - riskMetrics.daysUntilStockout;
    const revenueAtRisk = (product.price * product.avgDailySales * Math.max(gap, 1)).toFixed(0);

    supplyChainWarning =
      `Current stock of ${product.currentStock} units will be exhausted in ` +
      `${riskMetrics.daysUntilStockout} days. Supplier (${product.supplierCountry}) requires ` +
      `${product.supplierLeadTimeDays} days — a ${gap.toFixed(1)}-day stockout gap is imminent.`;

    actions.push({
      action: 'Emergency Stock Reorder',
      reason:
        `Only ${riskMetrics.daysUntilStockout} days of inventory remain but the supplier ` +
        `requires ${product.supplierLeadTimeDays} days. A ${gap.toFixed(1)}-day stockout ` +
        `window begins soon if no action is taken.`,
      expectedImpact:
        `Placing an emergency order now prevents an estimated $${revenueAtRisk} in ` +
        `lost revenue during the stockout window.`,
    });
  }

  // ── 2. Sales drop → recovery campaign ───────────────────────────────────
  if (riskMetrics.isSalesDrop) {
    actions.push({
      action: 'Sales Recovery Campaign',
      reason:
        `Sales declined ${product.salesChange7d}% over the last 7 days — well past the ` +
        `-15% alert threshold. Current velocity of ${product.avgDailySales} units/day ` +
        `is below sustainable levels.`,
      expectedImpact:
        'A targeted 7–10% limited-time discount or sponsored listing boost typically ' +
        'recovers 15–25% of lost weekly volume within 5–7 days.',
    });
  }

  // ── 3. Trend divergence → visibility/promotion ──────────────────────────
  if (riskMetrics.isTrendOpportunity && product.salesChange7d < 0) {
    trendOpportunity =
      `Search interest in "${product.name}" is up ${product.trendChange}% while your sales ` +
      `are falling — a critical missed-demand scenario. The market is actively looking for ` +
      `this product; a listing quality audit and competitive repricing should be the immediate priority.`;

    actions.push({
      action: 'Trend-Based Visibility Boost',
      reason:
        `Search intent is up ${product.trendChange}% but sales are down ${product.salesChange7d}% — ` +
        `a classic pricing or listing visibility mismatch. Competitors are likely capturing this demand.`,
      expectedImpact:
        'Closing the trend-sales gap through optimized listings or sponsored ads could fully ' +
        'reverse the current sales decline within 7–10 days.',
    });
  } else if (riskMetrics.isTrendOpportunity) {
    trendOpportunity =
      `Search trend for "${product.name}" is up ${product.trendChange}%. ` +
      `Increasing ad budget or running a bundle promotion now can maximize market share capture ` +
      `while demand is elevated.`;
  }

  // ── 4. Competitor price pressure ─────────────────────────────────────────
  if (riskMetrics.isPricePressure) {
    const direction = product.competitorPriceChange < 0 ? 'cut' : 'raised';
    const absChange = Math.abs(product.competitorPriceChange);

    actions.push({
      action: 'Competitive Pricing Review',
      reason:
        `A competitor ${direction} their price by ${absChange}% (above the ±5% alert threshold), ` +
        `directly affecting your ${product.category} market position.`,
      expectedImpact:
        product.competitorPriceChange < 0
          ? 'A 5–8% strategic price match or value-add bundle can recover lost market share within 2 weeks.'
          : 'Reinforcing premium positioning through enhanced product descriptions and reviews can capture the price-sensitive customer segment your competitor is vacating.',
    });
  }

  // ── 5. Low margin warning ────────────────────────────────────────────────
  if (product.profitMargin < 20) {
    financialWarning =
      `Profit margin of ${product.profitMargin}% is below the 20% healthy threshold. ` +
      `Aggressive discounting will push margins into negative territory. Prioritize ` +
      `cost-side improvements before competitive price reductions.`;

    actions.push({
      action: 'Margin Optimization Review',
      reason:
        `At ${product.profitMargin}% margin, this product has minimal buffer for ` +
        `cost shocks, price wars, or promotional campaigns.`,
      expectedImpact:
        'Supplier renegotiation targeting a 5–10% unit cost reduction could restore ' +
        'healthy margins without requiring any price changes.',
    });
  }

  // ── Default: no risks ────────────────────────────────────────────────────
  if (actions.length === 0) {
    actions.push({
      action: 'Continue Monitoring',
      reason: 'No critical risk signals detected. All monitored metrics are within acceptable thresholds.',
      expectedImpact:
        'Maintain current operations. Re-evaluate if weekly sales velocity drops below 10% or stock days fall under 2× supplier lead time.',
    });
  }

  // ── Build summary ────────────────────────────────────────────────────────
  const factorList = riskMetrics.factors
    .map((f) => f.type.replace(/_/g, ' ').toLowerCase())
    .join(', ');

  let summary;
  if (riskMetrics.score >= 75) {
    summary =
      `${product.name} is at HIGH risk (score: ${riskMetrics.score}/100). ` +
      `${riskMetrics.factors.length} critical signal(s) detected: ${factorList}. ` +
      `Immediate multi-front intervention is required to prevent significant revenue loss.`;
  } else if (riskMetrics.score >= 40) {
    summary =
      `${product.name} is at MEDIUM risk (score: ${riskMetrics.score}/100). ` +
      `${riskMetrics.factors.length} signal(s) detected (${factorList}) ` +
      `require attention within the next 3–5 business days.`;
  } else {
    summary =
      `${product.name} is currently LOW risk (score: ${riskMetrics.score}/100). ` +
      `No critical thresholds breached — standard monitoring recommended.`;
  }

  // ── Risk explanation ─────────────────────────────────────────────────────
  const riskExplanation =
    riskMetrics.factors.length > 0
      ? `${riskMetrics.factors.length} risk signal(s) detected: ${riskMetrics.factors.map((f) => f.detail).join('. ')}.`
      : 'All monitored metrics are within acceptable ranges. No risk factors breach current alert thresholds.';

  return {
    summary,
    riskExplanation,
    recommendedActions: actions,
    financialWarning,
    supplyChainWarning,
    trendOpportunity,
    confidence: riskMetrics.score >= 40 ? 'MEDIUM' : 'LOW',
  };
}
