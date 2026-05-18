import apiClient from './apiClient.js';

/** Fetch all products (no risk scores) */
export const fetchAllProducts = () => apiClient.get('/products');

/** Fetch a single product by ID */
export const fetchProductById = (id) => apiClient.get(`/products/${id}`);

/** Fetch all products with pre-calculated risk scores, sorted by risk */
export const fetchAlerts = () => apiClient.get('/alerts');
