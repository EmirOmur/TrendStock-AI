# TrendStock AI

> Gemini-powered e-commerce early warning and decision support assistant.

---

## Problem Statement

Online sellers often discover problems too late — stockouts, sales drops, competitor price wars, and missed trend opportunities cost them significant revenue every day. Existing analytics tools display raw data but don't explain *why* something is happening or *what to do* about it.

## Solution

TrendStock AI monitors product-level signals (sales velocity, stock levels, competitor prices, trend momentum, supplier lead times) and computes a deterministic risk score for each product. It then uses **Google Gemini** to generate plain-language explanations and concrete, actionable business recommendations — before damage occurs.

---

## Features

| Feature | Description |
|---------|-------------|
| Risk Dashboard | Ranked view of all products by calculated risk score |
| Stockout Detection | Alerts when current stock can't cover supplier lead time |
| Sales Drop Anomaly | Flags products with >15% week-over-week sales decline |
| Trend Opportunity | Surfaces products where search trends diverge from sales |
| Gemini Explanation | Natural language risk summary + recommended actions |
| Competitor Price Monitoring | Flags aggressive competitor pricing shifts (>5%) |
| Revenue at Risk | Estimated 7-day revenue exposure for high-risk products |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express, CORS, dotenv |
| AI / LLM | Google Gemini via `@google/genai` |
| Data (MVP) | Mock JavaScript objects |

---

## Architecture Summary

```
┌─────────────────────────────┐
│       React Frontend        │
│  Dashboard · Cards · Charts │
└────────────┬────────────────┘
             │ HTTP / Axios
             ▼
┌─────────────────────────────┐
│    Node.js Express API      │
│  /products · /alerts · /ai  │
└──────┬──────────┬───────────┘
       │          │
       ▼          ▼
┌──────────┐  ┌──────────────────┐
│Mock Data │  │  Risk Service    │
│ Products │  │ (Deterministic)  │
│ Trends   │  └────────┬─────────┘
└──────────┘           │
                        ▼
               ┌─────────────────┐
               │  Gemini Service │
               │  (Explanation)  │
               └─────────────────┘
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd TrendStock-AI

# 2. Backend
cd backend
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm run dev

# 3. Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

See [SETUP.md](./SETUP.md) for detailed instructions.

---

## Environment Variables

| Variable | File | Description |
|----------|------|-------------|
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key (required) |
| `PORT` | `backend/.env` | Backend port (default: 5000) |
| `VITE_API_BASE_URL` | `frontend/.env` | Backend API base URL |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Returns all mock products |
| `GET` | `/api/products/:id` | Returns a single product by ID |
| `GET` | `/api/alerts` | Returns all products with computed risk scores, sorted by risk |
| `POST` | `/api/ai/analyze-product` | Sends product + risk data to Gemini, returns structured analysis |

See [API_DESIGN.md](./API_DESIGN.md) for full request/response specs.

---

## Risk Score Logic

The backend computes a deterministic risk score (0–100) before calling Gemini:

| Condition | Points |
|-----------|--------|
| `salesChange7d < -15%` | +25 |
| `daysUntilStockout < supplierLeadTimeDays` | +30 |
| `\|competitorPriceChange\| > 5%` | +15 |
| `trendChange > 30% AND salesChange7d < 0` | +20 |
| `profitMargin < 20%` | +10 |
| **Maximum** | **100** |

Risk Levels: `LOW` (0–39) · `MEDIUM` (40–69) · `HIGH` (70–100)

Gemini does **not** calculate the score — it only explains and recommends.

---

## Future Improvements

- **Firebase Hosting** — Deploy frontend with zero config
- **Firestore** — Replace mock data with real-time product database
- **BigQuery ML** — Time-series sales forecasting at scale
- **Vertex AI** — Custom risk model fine-tuning
- **Cloud Run** — Containerized backend deployment
- **Google Merchant Center** — Real product catalog sync
- **Pub/Sub** — Real-time stock change events
- **Firebase Auth** — Multi-seller authentication

---

## Project Structure

```
TrendStock-AI/
  backend/
    src/
      server.js
      routes/        → Express route definitions
      controllers/   → Request handlers
      services/      → Business logic (risk, Gemini, trend, forecast)
      data/          → Mock product and trend data
      utils/         → Response formatting helpers
  frontend/
    src/
      api/           → Axios API client functions
      components/    → Reusable React components
      pages/         → Page-level components
      styles/        → Global CSS
```

---

*Built for Google Hackathon — powered by Google Gemini*
