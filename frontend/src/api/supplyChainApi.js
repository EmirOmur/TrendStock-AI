import apiClient from './apiClient.js';

export const getSupplyChainRisks = (params = {}) => apiClient.get('/supply-chain/risks', { params });
export const getSupplyChainRisk  = (id)           => apiClient.get(`/supply-chain/risks/${id}`);
