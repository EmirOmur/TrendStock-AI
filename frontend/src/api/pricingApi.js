import apiClient from './apiClient.js';

export const getPricingRecommendations = (params = {}) => apiClient.get('/pricing/recommendations', { params });
export const getPricingRecommendation  = (id)           => apiClient.get(`/pricing/recommendations/${id}`);
