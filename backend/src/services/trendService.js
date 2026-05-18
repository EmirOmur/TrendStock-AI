import { mockTrends } from '../data/mockTrends.js';

/**
 * Returns the trend data for a given product ID.
 * Returns null if no trend data is available.
 */
export function getTrendData(productId) {
  return mockTrends[productId] || null;
}

/**
 * Classifies a trend change value into a descriptive label.
 * @param {number} trendChange - Percentage change in search volume
 * @returns {string} Trend classification
 */
export function classifyTrend(trendChange) {
  if (trendChange >= 50) return 'EXPLOSIVE';
  if (trendChange >= 30) return 'STRONG';
  if (trendChange >= 10) return 'GROWING';
  if (trendChange >= -10) return 'STABLE';
  if (trendChange >= -30) return 'DECLINING';
  return 'COLLAPSING';
}

/**
 * Detects whether a product has a trend-sales divergence.
 * A divergence means the market wants the product (high trend) but sales are falling.
 * This typically points to a pricing, visibility, or listing quality problem.
 *
 * @param {number} trendChange - Search trend change percentage
 * @param {number} salesChange7d - 7-day sales change percentage
 * @returns {boolean}
 */
export function hasTrendDivergence(trendChange, salesChange7d) {
  return trendChange > 30 && salesChange7d < 0;
}

/**
 * Returns a human-readable opportunity description for a trending product.
 * @param {Object} product
 * @returns {string | null}
 */
export function getTrendOpportunityLabel(product) {
  if (product.trendChange <= 30) return null;

  const divergence = hasTrendDivergence(product.trendChange, product.salesChange7d);

  if (divergence) {
    return `${product.name} has a ${product.trendChange}% search trend increase but sales are declining — fix listing visibility or pricing to capture demand.`;
  }

  return `${product.name} is riding a ${product.trendChange}% search trend growth. Consider increasing ad spend or running a promotion to capture market share.`;
}
