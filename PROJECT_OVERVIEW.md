# TrendStock AI — Project Overview

## What Is This?

TrendStock AI is a hackathon MVP that solves a real problem for e-commerce sellers:
**they see data, but not insight**. The app detects product-level risk signals,
scores them deterministically, and asks Google Gemini to explain the risk in plain
language and recommend concrete business actions.

---

## Core User Flow

```
1. Seller opens dashboard
2. Dashboard loads /api/alerts → products sorted by risk score
3. Seller sees metric cards: High Risk count, Revenue at Risk, Trend Opportunities, Stockout Alerts
4. Seller clicks a product card
5. Right panel shows product details and an "Analyze with Gemini" button
6. Seller clicks the button → POST /api/ai/analyze-product
7. Gemini returns: summary, risk explanation, recommended actions, warnings, confidence
8. Seller reads the analysis and takes action
```

---

## Risk Signal Types

| Signal | Data Field | What It Means |
|--------|-----------|---------------|
| Sales Drop | `salesChange7d` | Revenue declining week-over-week |
| Stockout Risk | `currentStock / avgDailySales < supplierLeadTimeDays` | Won't survive reorder cycle |
| Price Pressure | `competitorPriceChange` | Competitor cutting prices aggressively |
| Trend Divergence | `trendChange > 30 && salesChange7d < 0` | Market wants this, but sales are falling — pricing or visibility issue |
| Low Margin | `profitMargin` | Below 20% — vulnerable to any cost increase |

---

## Gemini's Role

Gemini is used **only for explanation and recommendation** — not for scoring.

This design choice ensures:
- **Determinism**: risk scores are reproducible and auditable
- **Cost efficiency**: Gemini is called only when the user explicitly requests analysis
- **Trust**: sellers can understand *why* a product has a high score without Gemini
- **Speed**: the dashboard loads instantly from deterministic calculation

The Gemini prompt is carefully structured to:
- Act as an e-commerce risk analyst
- Only use provided data (no hallucination)
- Return valid JSON always
- Recommend practical, specific actions

---

## Mock Data Design

The MVP uses 6 mock products across different categories to demonstrate all risk types:

| Product | Category | Risk Level | Primary Risk |
|---------|----------|------------|--------------|
| BeanBliss Espresso Blend | Coffee | HIGH (80) | Sales drop + Stockout + Price pressure + Low margin |
| FastCharge Pro USB-C Hub | Electronics | LOW (0) | None — trend opportunity only |
| GlowUp Vitamin C Serum | Beauty | HIGH (90) | All 4 risk factors active |
| FlexFit Resistance Band Set | Sports | LOW (0) | Healthy product |
| CozyNest Air Purifier | Home | MEDIUM (55) | Stockout + Price pressure + Low margin |
| UrbanEdge Slim Fit Chinos | Fashion | HIGH (90) | Sales drop + Stockout + Trend divergence + Price war |

---

## Hackathon Scope

### In Scope (MVP)
- Static mock data
- Risk score calculation
- Gemini analysis on demand
- Dashboard UI with product cards
- Sales trend chart (Recharts)

### Out of Scope (Future)
- User authentication
- Real database (Firestore)
- Real-time data sync
- Multi-seller support
- Historical risk tracking
- Email/Slack alerts
- Mobile app

---

## Google Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Google Gemini** (`gemini-2.0-flash`) | Risk explanation + action recommendations |
| `@google/genai` SDK | Gemini API client |

### Planned Google Extensions
- **Firebase Hosting** — Frontend CDN deployment
- **Firestore** — Real product/sales database
- **BigQuery** — Sales analytics at scale
- **Vertex AI** — Custom forecasting models
- **Cloud Run** — Backend containerization
