import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import { fetchAlerts } from '../api/productApi.js';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts()
      .then((res) => setProducts(res.data.data))
      .catch(() => setError('Could not connect to the backend. Make sure it is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">📊</span>
          <h1 className="text-3xl font-bold text-gray-900">TrendStock AI</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">
          Gemini-powered e-commerce early warning &amp; decision support
        </p>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm">Loading product data...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium mb-1">Connection Error</p>
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-3">
            Run: <code className="bg-gray-100 px-1 rounded">cd backend &amp;&amp; npm run dev</code>
          </p>
        </div>
      )}

      {/* Dashboard */}
      {!loading && !error && <Dashboard products={products} />}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        TrendStock AI · Powered by Google Gemini · Hackathon MVP
      </footer>
    </div>
  );
}
