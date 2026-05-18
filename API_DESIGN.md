# TrendStock AI — API Design

Base URL: `http://localhost:5000/api`

All responses follow this envelope format:
```json
{
  "success": true,
  "data": <payload>,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## GET /api/products

Returns all mock products without risk scores.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_001",
      "name": "BeanBliss Espresso Blend",
      "category": "Coffee",
      "currentStock": 45,
      "avgDailySales": 12,
      "supplierLeadTimeDays": 7,
      "salesChange7d": -22,
      "trendChange": 15,
      "competitorPriceChange": -8,
      "profitMargin": 18,
      "supplierCountry": "Colombia",
      "price": 24.99,
      "previousPrice": 24.99,
      "imageUrl": null,
      "salesHistory": [
        { "day": "Day 1", "sales": 15 },
        { "day": "Day 2", "sales": 14 }
      ]
    }
  ],
  "timestamp": "..."
}
```

---

## GET /api/products/:id

Returns a single product by ID.

**Parameters:**
- `id` (path) — Product ID string, e.g. `prod_001`

**Response (200):**
```json
{
  "success": true,
  "data": { /* single product object */ },
  "timestamp": "..."
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Product not found",
  "timestamp": "..."
}
```

---

## GET /api/alerts

Returns all products with computed risk scores and flags, sorted by risk score descending (highest risk first).

This is the primary endpoint used by the dashboard.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_003",
      "name": "GlowUp Vitamin C Serum",
      "category": "Beauty",
      "currentStock": 30,
      "avgDailySales": 15,
      "supplierLeadTimeDays": 10,
      "salesChange7d": -18,
      "trendChange": 35,
      "competitorPriceChange": -6,
      "profitMargin": 25,
      "supplierCountry": "South Korea",
      "price": 34.99,
      "previousPrice": 39.99,
      "imageUrl": null,
      "salesHistory": [ ... ],
      "riskMetrics": {
        "score": 90,
        "level": "HIGH",
        "daysUntilStockout": 2.0,
        "factors": [
          { "type": "SALES_DROP", "points": 25, "detail": "Sales dropped -18% in 7 days" },
          { "type": "STOCKOUT_RISK", "points": 30, "detail": "Only 2.0 days of stock, supplier needs 10 days" },
          { "type": "PRICE_PRESSURE", "points": 15, "detail": "Competitor price changed by -6%" },
          { "type": "TREND_SALES_DIVERGENCE", "points": 20, "detail": "Trend up 35% but sales are declining" }
        ],
        "isStockoutRisk": true,
        "isSalesDrop": true,
        "isTrendOpportunity": true,
        "isPricePressure": true
      }
    }
  ],
  "timestamp": "..."
}
```

---

## POST /api/ai/analyze-product

Sends product data and pre-computed risk metrics to Google Gemini for explanation and action recommendations.

**Request Body:**
```json
{
  "product": {
    "id": "prod_001",
    "name": "BeanBliss Espresso Blend",
    "category": "Coffee",
    "currentStock": 45,
    "avgDailySales": 12,
    "supplierLeadTimeDays": 7,
    "salesChange7d": -22,
    "trendChange": 15,
    "competitorPriceChange": -8,
    "profitMargin": 18,
    "supplierCountry": "Colombia",
    "price": 24.99,
    "previousPrice": 24.99
  },
  "riskMetrics": {
    "score": 80,
    "level": "HIGH",
    "daysUntilStockout": 3.8,
    "factors": [ ... ],
    "isStockoutRisk": true,
    "isSalesDrop": true,
    "isTrendOpportunity": false,
    "isPricePressure": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": "BeanBliss Espresso Blend faces a critical combination of risks: a sharp 22% sales drop, a stockout window of only 3.8 days against a 7-day supplier lead time, and a competitor undercutting by 8%. Immediate action is required on multiple fronts.",
    "riskExplanation": "The product is experiencing a significant week-over-week sales decline of 22%, well above the -15% threshold for concern. At the current sales velocity of 12 units/day with only 45 units in stock, the product will stockout in 3.8 days — 3+ days before the supplier can restock (7-day lead time). A competitor has also reduced their price by 8%, which likely explains part of the sales decline. The 18% profit margin is below the 20% threshold, meaning the product has limited pricing flexibility to respond to competition.",
    "recommendedActions": [
      {
        "action": "Emergency Stock Reorder",
        "reason": "Current stock of 45 units at 12 units/day will be exhausted in 3.8 days, but the supplier requires 7 days. Place an emergency order immediately, or explore express shipping options from an alternative supplier.",
        "expectedImpact": "Prevents stockout; maintaining availability during this critical period could recover $840+ in lost revenue over the reorder gap."
      },
      {
        "action": "Targeted Discount Campaign (5–8%)",
        "reason": "A competitor has cut prices by 8%, which is likely driving the 22% sales drop. A temporary promotion can win back price-sensitive customers before competitors lock in loyalty.",
        "expectedImpact": "A 5% discount ($23.74 from $24.99) could recover 10–15 units/day volume while maintaining positive contribution margin."
      },
      {
        "action": "Supplier Diversification Review",
        "reason": "A 7-day lead time with only 3.8 days of stock headroom leaves no buffer for delays. A second supplier with a shorter lead time (3–5 days) would eliminate this recurring stockout risk.",
        "expectedImpact": "Reduces stockout risk from HIGH to LOW; increases supply chain resilience for this category."
      }
    ],
    "financialWarning": "With a profit margin of 18% and a competitor aggressively cutting prices, any further price reduction will push margins below profitability. A cost-side audit (sourcing, shipping) is recommended before responding to the price war.",
    "supplyChainWarning": "Stockout is imminent within 4 days. Colombia-origin supply chains can experience 2–5 day additional delays due to export processing. Emergency reorder must be placed within 24 hours.",
    "trendOpportunity": null,
    "confidence": "HIGH"
  },
  "timestamp": "..."
}
```

**Response (400) — Missing fields:**
```json
{
  "success": false,
  "error": "product and riskMetrics are required",
  "timestamp": "..."
}
```

**Response (500) — Gemini API error:**
```json
{
  "success": false,
  "error": "Failed to get AI analysis: <error detail>",
  "timestamp": "..."
}
```

---

## Risk Metrics Object Reference

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | 0–100 composite risk score |
| `level` | `'LOW' \| 'MEDIUM' \| 'HIGH'` | Score bucket |
| `daysUntilStockout` | `number` | `currentStock / avgDailySales` |
| `factors` | `Array` | Each contributing risk factor with type, points, and detail |
| `isStockoutRisk` | `boolean` | `daysUntilStockout < supplierLeadTimeDays` |
| `isSalesDrop` | `boolean` | `salesChange7d < -15` |
| `isTrendOpportunity` | `boolean` | `trendChange > 30` |
| `isPricePressure` | `boolean` | `Math.abs(competitorPriceChange) > 5` |

## Risk Factor Types

| type | Condition | Points |
|------|-----------|--------|
| `SALES_DROP` | `salesChange7d < -15` | 25 |
| `STOCKOUT_RISK` | `daysUntilStockout < supplierLeadTimeDays` | 30 |
| `PRICE_PRESSURE` | `\|competitorPriceChange\| > 5` | 15 |
| `TREND_SALES_DIVERGENCE` | `trendChange > 30 && salesChange7d < 0` | 20 |
| `LOW_MARGIN` | `profitMargin < 20` | 10 |
