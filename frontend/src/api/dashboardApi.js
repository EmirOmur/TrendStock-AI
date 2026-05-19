import apiClient from './apiClient.js';

export const getDashboardSummary = () => apiClient.get('/dashboard/summary');
