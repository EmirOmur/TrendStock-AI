import apiClient from './apiClient.js';

export const fetchProducts    = ()   => apiClient.get('/products');
export const fetchAllProducts = ()   => apiClient.get('/products');
export const fetchProductById = (id) => apiClient.get(`/products/${id}`);
export const fetchAlerts      = ()   => apiClient.get('/alerts');
export const fetchOverview    = ()   => apiClient.get('/overview');
