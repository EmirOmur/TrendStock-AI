import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productRoutes       from './routes/productRoutes.js';
import alertRoutes         from './routes/alertRoutes.js';
import aiRoutes            from './routes/aiRoutes.js';
import newsRoutes          from './routes/newsRoutes.js';
import marketSignalRoutes  from './routes/marketSignalRoutes.js';
import overviewRoutes      from './routes/overviewRoutes.js';
import salesHistoryRoutes  from './routes/salesHistoryRoutes.js';
import dashboardRoutes     from './routes/dashboardRoutes.js';
import pricingRoutes       from './routes/pricingRoutes.js';
import fintechRoutes       from './routes/fintechRoutes.js';
import supplyChainRoutes   from './routes/supplyChainRoutes.js';
import agentRoutes         from './routes/agentRoutes.js';
import reportRoutes        from './routes/reportRoutes.js';
import actionsRoutes       from './routes/actionsRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TrendStock AI backend is running',
    version: '2.0.0',
    availableEndpoints: [
      'GET  /api/products',
      'GET  /api/products/:id',
      'GET  /api/alerts',
      'GET  /api/overview',
      'POST /api/ai/analyze-product',
      'GET  /api/news',
      'GET  /api/market-signals',
      'GET  /api/sales-history',
      'GET  /api/sales-history/:productId',
      'GET  /api/dashboard/summary',
      'GET  /api/trends',
      'GET  /api/pricing/recommendations',
      'GET  /api/fintech/offers',
      'GET  /api/supply-chain/risks',
      'GET  /api/agents/logs',
      'GET  /api/reports/weekly',
      'GET  /health',
    ],
  });
});

// ─── Existing Routes ──────────────────────────────────────────────────────────
app.use('/api/products',       productRoutes);
app.use('/api/alerts',         alertRoutes);
app.use('/api/ai',             aiRoutes);
app.use('/api/news',           newsRoutes);
app.use('/api/market-signals', marketSignalRoutes);
app.use('/api/overview',       overviewRoutes);
app.use('/api/sales-history',  salesHistoryRoutes);

// ─── New Routes ───────────────────────────────────────────────────────────────
app.use('/api/dashboard',      dashboardRoutes);
app.use('/api/pricing',        pricingRoutes);
app.use('/api/fintech',        fintechRoutes);
app.use('/api/supply-chain',   supplyChainRoutes);
app.use('/api/agents',         agentRoutes);
app.use('/api/reports',        reportRoutes);
app.use('/api/actions',        actionsRoutes);

// Trends endpoint (uses market signals)
app.get('/api/trends', (req, res) => {
  res.redirect('/api/market-signals');
});

// Inventory risks — served by products route enrichment
app.get('/api/inventory/risks', async (req, res) => {
  try {
    const { mockProducts } = await import('./data/mockProducts.js');
    const risks = mockProducts
      .map(p => ({ ...p, daysUntilStockout: p.daysUntilStockout ?? Math.round(p.currentStock / p.avgDailySales) }))
      .filter(p => p.daysUntilStockout < p.supplierLeadTimeDays)
      .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
    res.json({ success: true, data: risks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load inventory risks' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status:           'ok',
    service:          'TrendStock AI Backend',
    timestamp:        new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 TrendStock AI v2.0 backend running on http://localhost:${PORT}`);
  console.log(`📊 Mock data: 25 products · 10 pricing · 8 fintech · 8 supply chain`);
  console.log(`🤖 Gemini model: gemini-2.0-flash`);
  console.log(`🔑 Gemini API key: ${process.env.GEMINI_API_KEY ? 'configured ✓' : 'NOT SET — fallback mode'}`);
  console.log(`\nKey endpoints:`);
  console.log(`  GET /api/dashboard/summary`);
  console.log(`  GET /api/pricing/recommendations`);
  console.log(`  GET /api/fintech/offers`);
  console.log(`  GET /api/supply-chain/risks`);
  console.log(`  GET /api/agents/logs`);
  console.log(`  GET /api/reports/weekly\n`);
});
