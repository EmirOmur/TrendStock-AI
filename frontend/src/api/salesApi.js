import apiClient from './apiClient.js';

/** Fetch full sales history for all tracked products */
export const fetchSalesHistory = () => apiClient.get('/sales-history');

/** Fetch 14-day sales history for a specific product */
export const fetchSalesHistoryByProduct = (productId) =>
  apiClient.get(`/sales-history/${productId}`);
