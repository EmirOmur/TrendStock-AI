import { mockProducts } from '../data/mockProducts.js';
import { calculateRiskMetrics } from '../services/riskService.js';
import { formatSuccess } from '../utils/responseFormatter.js';

/**
 * GET /api/alerts
 * Returns all products with computed risk scores, sorted by risk score descending.
 * This is the primary endpoint for the dashboard.
 */
export const getAlerts = (req, res) => {
  const productsWithRisk = mockProducts.map((product) => ({
    ...product,
    riskMetrics: calculateRiskMetrics(product),
  }));

  // Sort highest risk first so the most critical items appear at the top
  productsWithRisk.sort((a, b) => b.riskMetrics.score - a.riskMetrics.score);

  res.json(formatSuccess(productsWithRisk));
};
