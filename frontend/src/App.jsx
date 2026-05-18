import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout.jsx';
import DashboardPage    from './pages/DashboardPage.jsx';
import ProductsPage     from './pages/ProductsPage.jsx';
import AiAnalysisPage   from './pages/AiAnalysisPage.jsx';
import TrendRadarPage   from './pages/TrendRadarPage.jsx';
import NewsMonitorPage  from './pages/NewsMonitorPage.jsx';
import SalesForecastPage from './pages/SalesForecastPage.jsx';
import SettingsPage     from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/ai-analysis"    element={<AiAnalysisPage />} />
          <Route path="/trend-radar"    element={<TrendRadarPage />} />
          <Route path="/news-monitor"   element={<NewsMonitorPage />} />
          <Route path="/sales-forecast" element={<SalesForecastPage />} />
          <Route path="/settings"       element={<SettingsPage />} />
          <Route path="*"               element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
