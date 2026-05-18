import apiClient from './apiClient.js';

/** Fetch all market news items */
export const fetchNews = () => apiClient.get('/news');
