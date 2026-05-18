import apiClient from './apiClient.js';

/** Fetch all market trend signals */
export const fetchMarketSignals = () => apiClient.get('/market-signals');

/** Fetch all news items */
export const fetchNews = () => apiClient.get('/news');
