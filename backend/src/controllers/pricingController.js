import { getPricingRecommendations, getPricingById } from '../services/pricingService.js';

export function listPricingRecommendations(req, res) {
  try {
    const { category, status } = req.query;
    const result = getPricingRecommendations({ category, status });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[pricingController]', err);
    res.status(500).json({ success: false, error: 'Failed to load pricing recommendations' });
  }
}

export function getPricingRecommendation(req, res) {
  try {
    const item = getPricingById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Pricing recommendation not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load pricing recommendation' });
  }
}
