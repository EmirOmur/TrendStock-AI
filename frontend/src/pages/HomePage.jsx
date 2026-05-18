import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { fetchAlerts } from '../api/productApi.js';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetchAlerts()
      .then((res) => setProducts(res.data.data))
      .catch(() =>
        setError('Could not connect to the backend. Make sure it is running on port 5000.')
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading risk intelligence data..." />;
  if (error)   return <ErrorBanner message={error} />;

  return <Dashboard products={products} />;
}
