import apiClient from './apiClient.js';

export const getFintechOffers = (params = {}) => apiClient.get('/fintech/offers', { params });
export const getFintechOffer  = (id)           => apiClient.get(`/fintech/offers/${id}`);
