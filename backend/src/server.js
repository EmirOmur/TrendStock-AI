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

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/products',       productRoutes);
app.use('/api/alerts',         alertRoutes);
app.use('/api/ai',             aiRoutes);
app.use('/api/news',           newsRoutes);
app.use('/api/market-signals', marketSignalRoutes);
app.use('/api/overview',       overviewRoutes);
app.use('/api/sales-history',  salesHistoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status:           'ok',
    service:          'TrendStock AI Backend',
    timestamp:        new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 TrendStock AI backend running on http://localhost:${PORT}`);
  console.log(`📊 Mock data: 18 products · 12 news items · 12 market signals`);
  console.log(`🤖 Gemini model: gemini-2.0-flash`);
  console.log(`🔑 Gemini API key: ${process.env.GEMINI_API_KEY ? 'configured ✓' : 'NOT SET — fallback mode will be used'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/products`);
  console.log(`  GET  /api/products/:id`);
  console.log(`  GET  /api/alerts`);
  console.log(`  GET  /api/overview`);
  console.log(`  POST /api/ai/analyze-product`);
  console.log(`  GET  /api/news`);
  console.log(`  GET  /api/market-signals`);
  console.log(`  GET  /api/sales-history`);
  console.log(`  GET  /api/sales-history/:productId`);
  console.log(`  GET  /health\n`);
});
