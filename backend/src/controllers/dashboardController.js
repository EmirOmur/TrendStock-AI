import { mockProducts } from '../data/mockProducts.js';
import { mockFintechOffers } from '../data/mockFintechOffers.js';
import { mockPricingRecommendations } from '../data/mockPricingRecommendations.js';

function calcRiskScore(p) {
  let score = 0;
  const days = p.currentStock / p.avgDailySales;
  if (days < p.supplierLeadTimeDays) score += 30;
  if (p.salesChange7d < -15) score += 25;
  if (Math.abs(p.competitorPriceChange) > 5) score += 15;
  if (p.trendChange > 30 && p.salesChange7d < 0) score += 20;
  if (p.profitMargin < 20) score += 10;
  return Math.min(score, 100);
}

export function getDashboardSummary(req, res) {
  try {
    const products = mockProducts.map(p => ({
      ...p,
      riskScore: calcRiskScore(p),
      daysUntilStockout: p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales),
    }));

    const highRisk = products.filter(p => p.riskScore >= 70);
    const mediumRisk = products.filter(p => p.riskScore >= 40 && p.riskScore < 70);
    const stockoutRisk = products.filter(p => p.daysUntilStockout < p.supplierLeadTimeDays);
    const trendOpportunity = products.filter(p => p.trendChange >= 30);
    const totalRevenue = products.reduce((s, p) => s + (p.revenue7d || 0), 0);
    const avgRisk = Math.round(products.reduce((s, p) => s + p.riskScore, 0) / products.length);

    const financingOps = mockFintechOffers.filter(o => o.status === 'available').length;
    const pricingOps = mockPricingRecommendations.filter(r => r.status === 'pending').length;
    const avgROI = Math.round(
      mockFintechOffers.reduce((s, o) => s + o.estimatedROI, 0) / mockFintechOffers.length
    );

    const topRisky = products
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        riskScore: p.riskScore,
        riskLevel: p.riskScore >= 70 ? 'HIGH' : p.riskScore >= 40 ? 'MEDIUM' : 'LOW',
        daysUntilStockout: p.daysUntilStockout,
        trendChange: p.trendChange,
        isStockoutRisk: p.daysUntilStockout < p.supplierLeadTimeDays,
        isTrendOpportunity: p.trendChange >= 30,
      }));

    const heroProduct = products.find(p => p.id === 'prod_101');

    const revenueTrend = [
      { day: 'Mon', revenue: 71200 },
      { day: 'Tue', revenue: 74800 },
      { day: 'Wed', revenue: 78100 },
      { day: 'Thu', revenue: 81400 },
      { day: 'Fri', revenue: 86200 },
      { day: 'Sat', revenue: 77500 },
      { day: 'Sun', revenue: 73600 },
    ];

    const categoryChart = [
      { category: 'Electronics', revenue: 145200, risk: 72 },
      { category: 'Gaming', revenue: 123400, risk: 68 },
      { category: 'Sports', revenue: 92100, risk: 25 },
      { category: 'Beauty', revenue: 87600, risk: 55 },
      { category: 'Coffee', revenue: 71900, risk: 62 },
      { category: 'Home', revenue: 58400, risk: 45 },
      { category: 'Fashion', revenue: 41200, risk: 60 },
    ];

    res.json({
      success: true,
      data: {
        totals: {
          products: products.length,
          highRisk: highRisk.length,
          mediumRisk: mediumRisk.length,
          stockoutRisk: stockoutRisk.length,
          trendOpportunity: trendOpportunity.length,
          financingOpportunities: financingOps,
          pricingOpportunities: pricingOps,
        },
        financials: {
          totalRevenue7d: totalRevenue,
          revenueAtRisk: Math.round(totalRevenue * 0.32),
          avgRiskScore: avgRisk,
          expectedROIFromActions: avgROI,
          salesDrop: products.filter(p => p.salesChange7d < -15).length,
          pricePressure: products.filter(p => Math.abs(p.competitorPriceChange) > 5).length,
        },
        heroRecommendation: heroProduct ? {
          productId: heroProduct.id,
          productName: heroProduct.name,
          trend: `+${heroProduct.predictedDemandIncrease}% expected demand increase`,
          inventoryRisk: `Stockout in ${heroProduct.daysUntilStockout} days`,
          pricingAction: `+7% suggested price increase (₺1,299 → ₺1,389)`,
          fintechAction: `₺85,000 micro-credit offer available`,
          expectedROI: `${heroProduct.expectedROI}%`,
          recommendedReorderQty: heroProduct.recommendedReorderQty,
          financingNeeded: heroProduct.financingNeeded,
        } : null,
        topRisky,
        revenueTrend,
        categoryChart,
      },
    });
  } catch (err) {
    console.error('[dashboardController] error:', err);
    res.status(500).json({ success: false, error: 'Failed to load dashboard summary' });
  }
}
