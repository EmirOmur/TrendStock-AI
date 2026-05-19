import apiClient from './apiClient.js';

export const getAgentLogs = (params = {}) => apiClient.get('/agents/logs', { params });
