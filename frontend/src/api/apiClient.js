import axios from 'axios';

// Single Axios instance shared across all API modules.
// Base URL is read from Vite environment variables — set in frontend/.env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s — Gemini can take a few seconds on first request
});

export default apiClient;
