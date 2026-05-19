import { mockPricingRecommendations } from '../data/mockPricingRecommendations.js';

export function getPricingRecommendations(filters = {}) {
  let data = [...mockPricingRecommendations];

  if (filters.category) {
    data = data.filter(r => r.category.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.status) {
    data = data.filter(r => r.status === filters.status);
  }

  const summary = {
    total: mockPricingRecommendations.length,
    increases: mockPricingRecommendations.filter(r => r.priceChangePct > 0).length,
    decreases: mockPricingRecommendations.filter(r => r.priceChangePct < 0).length,
    totalRevenueImpact: mockPricingRecommendations.reduce((s, r) => s + r.expectedRevenueImpact, 0),
    avgConfidence: Math.round(mockPricingRecommendations.reduce((s, r) => s + r.confidence, 0) / mockPricingRecommendations.length),
  };

  return { recommendations: data, summary };
}

export function getPricingById(id) {
  return mockPricingRecommendations.find(r => r.id === id) || null;
}
