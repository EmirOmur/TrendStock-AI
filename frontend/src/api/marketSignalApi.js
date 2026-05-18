import apiClient from './apiClient.js';

/** Fetch all market trend signals */
export const fetchMarketSignals = () => apiClient.get('/market-signals');
