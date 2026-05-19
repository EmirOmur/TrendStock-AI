import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import AppLayout               from './layout/AppLayout.jsx';
import DashboardPage           from './pages/DashboardPage.jsx';
import ProductsPage            from './pages/ProductsPage.jsx';
import TrendRadarPage          from './pages/TrendRadarPage.jsx';
import NewsMonitorPage         from './pages/NewsMonitorPage.jsx';
import InventoryIntelligencePage from './pages/InventoryIntelligencePage.jsx';
import DynamicPricingPage      from './pages/DynamicPricingPage.jsx';
import FintechActionsPage      from './pages/FintechActionsPage.jsx';
import SupplyChainRiskPage     from './pages/SupplyChainRiskPage.jsx';
import AiAgentConsolePage      from './pages/AiAgentConsolePage.jsx';
import ReportsPage             from './pages/ReportsPage.jsx';
import SettingsPage            from './pages/SettingsPage.jsx';
import AiAnalysisPage          from './pages/AiAnalysisPage.jsx';
import SalesForecastPage       from './pages/SalesForecastPage.jsx';

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index                          element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"              element={<DashboardPage />} />
          <Route path="/products"               element={<ProductsPage />} />
          <Route path="/trend-radar"            element={<TrendRadarPage />} />
          <Route path="/news-monitor"           element={<NewsMonitorPage />} />
          <Route path="/inventory"              element={<InventoryIntelligencePage />} />
          <Route path="/dynamic-pricing"        element={<DynamicPricingPage />} />
          <Route path="/fintech-actions"        element={<FintechActionsPage />} />
          <Route path="/supply-chain"           element={<SupplyChainRiskPage />} />
          <Route path="/ai-agent-console"       element={<AiAgentConsolePage />} />
          <Route path="/reports"                element={<ReportsPage />} />
          <Route path="/settings"               element={<SettingsPage />} />
          <Route path="/ai-analysis"            element={<AiAnalysisPage />} />
          <Route path="/sales-forecast"         element={<SalesForecastPage />} />
          <Route path="*"                       element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}
