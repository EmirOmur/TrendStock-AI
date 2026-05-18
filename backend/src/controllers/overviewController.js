import { mockProducts } from '../data/mockProducts.js';
import { calculateRiskMetrics } from '../services/riskService.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';

// Pre-compute risk metrics for all products
const productsWithRisk = mockProducts.map((p) => ({
  ...p,
  riskMetrics: calculateRiskMetrics(p),
}));

/**
 * GET /api/overview
 * Returns aggregated dashboard KPIs calculated from all products.
 */
export const getOverview = (req, res) => {
  try {
    const highRisk   = productsWithRisk.filter((p) => p.riskMetrics.level === 'HIGH');
    const mediumRisk = productsWithRisk.filter((p) => p.riskMetrics.level === 'MEDIUM');
    const lowRisk    = productsWithRisk.filter((p) => p.riskMetrics.level === 'LOW');

    const stockoutRisk      = productsWithRisk.filter((p) => p.riskMetrics.isStockoutRisk);
    const trendOpportunity  = productsWithRisk.filter((p) => p.riskMetrics.isTrendOpportunity);
    const pricePressure     = productsWithRisk.filter((p) => p.riskMetrics.isPricePressure);
    const salesDrop         = productsWithRisk.filter((p) => p.riskMetrics.isSalesDrop);

    // Revenue at risk: 7-day HIGH-risk revenue × |sales decline %|
    const revenueAtRisk = highRisk.reduce((sum, p) => {
      const declineFraction = Math.abs(Math.min(p.salesChange7d, 0)) / 100;
      return sum + p.price * p.avgDailySales * 7 * declineFraction;
    }, 0);

    // Total 7d revenue across all products
    const totalRevenue7d = productsWithRisk.reduce((sum, p) => sum + (p.revenue7d || 0), 0);

    // Average risk score
    const avgRiskScore = Math.round(
      productsWithRisk.reduce((sum, p) => sum + p.riskMetrics.score, 0) / productsWithRisk.length,
    );

    // Average rating
    const avgRating = parseFloat(
      (productsWithRisk.reduce((sum, p) => sum + (p.rating || 0), 0) / productsWithRisk.length).toFixed(1),
    );

    // Top 5 riskiest products (summary only)
    const topRisky = [...productsWithRisk]
      .sort((a, b) => b.riskMetrics.score - a.riskMetrics.score)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        riskScore: p.riskMetrics.score,
        riskLevel: p.riskMetrics.level,
        isStockoutRisk: p.riskMetrics.isStockoutRisk,
        isTrendOpportunity: p.riskMetrics.isTrendOpportunity,
      }));

    // Risk distribution by category
    const categoryRisk = productsWithRisk.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = { category: p.category, count: 0, avgScore: 0, highCount: 0 };
      acc[p.category].count++;
      acc[p.category].avgScore += p.riskMetrics.score;
      if (p.riskMetrics.level === 'HIGH') acc[p.category].highCount++;
      return acc;
    }, {});

    const categoryBreakdown = Object.values(categoryRisk).map((c) => ({
      ...c,
      avgScore: Math.round(c.avgScore / c.count),
    }));

    res.json(
      formatSuccess({
        totals: {
          products:        productsWithRisk.length,
          highRisk:        highRisk.length,
          mediumRisk:      mediumRisk.length,
          lowRisk:         lowRisk.length,
          stockoutRisk:    stockoutRisk.length,
          trendOpportunity: trendOpportunity.length,
          pricePressure:   pricePressure.length,
          salesDrop:       salesDrop.length,
        },
        financials: {
          revenueAtRisk:   parseFloat(revenueAtRisk.toFixed(2)),
          totalRevenue7d,
          avgRiskScore,
          avgRating,
        },
        topRisky,
        categoryBreakdown,
      }),
    );
  } catch (err) {
    console.error('[overviewController] Error:', err);
    res.status(500).json(formatError('Failed to compute overview metrics'));
  }
};
