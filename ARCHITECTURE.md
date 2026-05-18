# TrendStock AI — Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (User)                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                  │  │
│  │                                                    │  │
│  │  HomePage → Dashboard → ProductCard × N           │  │
│  │                       → MetricCard × 4            │  │
│  │                       → SalesChart                │  │
│  │                       → AiRecommendationPanel     │  │
│  │                       → TrendPanel                │  │
│  │                                                    │  │
│  │  api/ → apiClient (Axios) → productApi, aiApi     │  │
│  └──────────────────────┬─────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────┘
                          │ HTTP REST (JSON)
                          │ VITE_API_BASE_URL
                          ▼
┌──────────────────────────────────────────────────────────┐
│              Node.js Express Backend (Port 5000)          │
│                                                          │
│  server.js                                               │
│  ├── /api/products     → productRoutes → productController│
│  ├── /api/alerts       → alertRoutes   → alertController  │
│  └── /api/ai           → aiRoutes      → aiController     │
│                                                          │
│  Services:                                               │
│  ├── riskService.js    → Deterministic risk scoring      │
│  ├── geminiService.js  → Google Gemini API calls         │
│  ├── trendService.js   → Trend analysis helpers          │
│  └── forecastService.js → Simple stockout forecasting    │
│                                                          │
│  Data Layer (Mock):                                      │
│  ├── mockProducts.js   → 6 products with all fields      │
│  └── mockTrends.js     → 14-day sales history per product│
└─────────────────────────┬────────────────────────────────┘
                          │ HTTPS (REST API)
                          ▼
┌──────────────────────────────────────────────────────────┐
│             Google Gemini API                             │
│             Model: gemini-2.0-flash                      │
│             SDK: @google/genai                           │
└──────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### Frontend

#### Pages
- **HomePage** — Top-level page. Fetches alert data from `/api/alerts` on mount. Passes data to Dashboard.

#### Components
- **Dashboard** — Main layout. Renders metric cards + product grid + right-side analysis panel. Manages selected product and analysis state.
- **MetricCard** — Displays a single KPI (count, revenue, etc.) with color coding.
- **ProductCard** — Displays a product with its risk score bar, risk badge, key metrics, and risk flags. Clickable.
- **RiskBadge** — Color-coded `HIGH` / `MEDIUM` / `LOW` label.
- **SalesChart** — Recharts `LineChart` showing 14-day daily sales for the selected product.
- **AiRecommendationPanel** — Shows the "Analyze with Gemini" button and renders the structured Gemini response.
- **TrendPanel** — Shows supplementary trend info: search trend, competitor price, supplier details.

#### API Layer
- **apiClient** — Axios instance with base URL, timeout, and Content-Type header.
- **productApi** — `fetchAllProducts`, `fetchProductById`, `fetchAlerts`
- **aiApi** — `analyzeProduct(product, riskMetrics)`

---

### Backend

#### Routes
Each route file maps HTTP methods + paths to controller functions.

```
GET  /api/products          → productController.getAllProducts
GET  /api/products/:id      → productController.getProductById
GET  /api/alerts            → alertController.getAlerts
POST /api/ai/analyze-product → aiController.analyzeProduct
```

#### Controllers
Thin request/response handlers. Validate input, call services, return formatted responses.

#### Services

**riskService.js** — Pure deterministic logic. Given a product object, returns:
```js
{
  score: 0-100,
  level: 'LOW' | 'MEDIUM' | 'HIGH',
  daysUntilStockout: Number,
  factors: Array<{ type, points, detail }>,
  isStockoutRisk: Boolean,
  isSalesDrop: Boolean,
  isTrendOpportunity: Boolean,
  isPricePressure: Boolean,
}
```

**geminiService.js** — Calls `@google/genai`. Builds a structured prompt with product data + risk metrics, requests JSON-only response, strips any markdown fences, parses and returns.

**trendService.js** — Utility functions for trend analysis (identifying divergence, categorizing trends).

**forecastService.js** — Simple arithmetic forecasting (e.g., days until stockout, projected revenue loss).

---

## Risk Scoring Logic

The risk score is computed **entirely in the backend** before Gemini is involved.

```
score = 0

if salesChange7d < -15:         score += 25  (SALES_DROP)
if daysUntilStockout < leadTime: score += 30  (STOCKOUT_RISK)
if |competitorPriceChange| > 5:  score += 15  (PRICE_PRESSURE)
if trendChange > 30 && salesChange7d < 0: score += 20 (TREND_DIVERGENCE)
if profitMargin < 20:            score += 10  (LOW_MARGIN)

score = min(score, 100)

level = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
```

**Why deterministic?**
- Scores are reproducible without API calls
- Dashboard loads instantly (no AI latency on page load)
- Gemini is reserved for user-requested deep analysis
- Auditable: sellers can see exactly which factors drove the score

---

## Gemini Integration

### When It's Called
Only on `POST /api/ai/analyze-product` — user explicitly clicks "Analyze with Gemini".

### What It Receives
```json
{
  "product": { /* full product object */ },
  "riskMetrics": { /* score, level, factors, flags */ }
}
```

### Prompt Design Principles
1. Role: "You are an expert e-commerce risk analyst"
2. Data: Inject product + riskMetrics as JSON
3. Rules: Only use provided data, return valid JSON only, no markdown
4. Structure: Exact JSON schema in the prompt

### Response Schema
```json
{
  "summary": "string",
  "riskExplanation": "string",
  "recommendedActions": [{ "action", "reason", "expectedImpact" }],
  "financialWarning": "string | null",
  "supplyChainWarning": "string | null",
  "trendOpportunity": "string | null",
  "confidence": "LOW | MEDIUM | HIGH"
}
```

---

## Data Flow: Dashboard Load

```
Browser → GET /api/alerts
Backend: mockProducts.forEach(p => calculateRiskMetrics(p))
       → sort by riskMetrics.score DESC
       → return array
Frontend: renders MetricCards, ProductCards
```

## Data Flow: Gemini Analysis

```
User clicks "Analyze with Gemini"
→ POST /api/ai/analyze-product { product, riskMetrics }
→ Backend: builds Gemini prompt
→ Gemini API: returns JSON text
→ Backend: parse + validate JSON
→ return { success: true, data: analysis }
→ Frontend: renders AiRecommendationPanel
```

---

## Future Google Cloud Extensions

### Phase 2 — Real Data
| Component | Google Service | Purpose |
|-----------|---------------|---------|
| Product database | **Firestore** | Real-time product catalog |
| Sales history | **BigQuery** | Scalable time-series storage |
| Auth | **Firebase Auth** | Multi-seller login |

### Phase 3 — Advanced AI
| Component | Google Service | Purpose |
|-----------|---------------|---------|
| Demand forecast | **BigQuery ML** | ARIMA+ sales prediction |
| Custom risk model | **Vertex AI** | Fine-tuned classifier |
| Embeddings | **Vertex AI Embeddings** | Similar product clustering |

### Phase 4 — Production Infrastructure
| Component | Google Service | Purpose |
|-----------|---------------|---------|
| Backend hosting | **Cloud Run** | Containerized auto-scaling |
| Frontend hosting | **Firebase Hosting** | Global CDN |
| Event streaming | **Pub/Sub** | Real-time stock alerts |
| Logging | **Cloud Logging** | Centralized observability |
