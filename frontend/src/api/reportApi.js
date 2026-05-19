import apiClient from './apiClient.js';

export const getWeeklyReport = () => apiClient.get('/reports/weekly');
