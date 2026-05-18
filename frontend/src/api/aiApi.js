import apiClient from './apiClient.js';

/**
 * Send a product and its risk metrics to the backend for Gemini analysis.
 * @param {Object} product - Full product object
 * @param {Object} riskMetrics - Pre-calculated risk metrics
 */
export const analyzeProduct = (product, riskMetrics) =>
  apiClient.post('/ai/analyze-product', { product, riskMetrics });
