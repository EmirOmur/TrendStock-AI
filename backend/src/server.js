import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);

// Health check — useful for deployment and debugging
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TrendStock AI Backend',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// 404 handler for unmatched routes
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
  console.log(`📊 Mock data loaded: 6 products`);
  console.log(`🤖 Gemini model: gemini-2.0-flash`);
  console.log(`🔑 Gemini API key: ${process.env.GEMINI_API_KEY ? 'configured' : 'NOT SET — /api/ai/analyze-product will fail'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/products`);
  console.log(`  GET  http://localhost:${PORT}/api/products/:id`);
  console.log(`  GET  http://localhost:${PORT}/api/alerts`);
  console.log(`  POST http://localhost:${PORT}/api/ai/analyze-product`);
  console.log(`  GET  http://localhost:${PORT}/health\n`);
});
