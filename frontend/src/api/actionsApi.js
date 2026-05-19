import apiClient from './apiClient.js';

export const getActions = () => apiClient.get('/actions');
