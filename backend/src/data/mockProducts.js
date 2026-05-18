// Mock product catalog — 6 products across different categories.
// Each product covers different risk scenarios for demo purposes.
//
// Risk score breakdown per product (see riskService.js for logic):
//   prod_001 (Coffee)       → 80  HIGH  — sales drop + stockout + price war + low margin
//   prod_002 (Electronics)  → 0   LOW   — healthy; trend opportunity only
//   prod_003 (Beauty)       → 90  HIGH  — all 4 major risk factors active
//   prod_004 (Sports)       → 0   LOW   — healthy product
//   prod_005 (Home)         → 55  MEDIUM— stockout + price war + low margin
//   prod_006 (Fashion)      → 90  HIGH  — sales drop + stockout + trend divergence + price war

export const mockProducts = [
  {
    id: 'prod_001',
    name: 'BeanBliss Espresso Blend',
    category: 'Coffee',
    price: 24.99,
    previousPrice: 24.99,
    currentStock: 45,
    avgDailySales: 12,           // daysUntilStockout = 45/12 = 3.75
    supplierLeadTimeDays: 7,     // 3.75 < 7 → STOCKOUT_RISK +30
    salesChange7d: -22,          // < -15 → SALES_DROP +25
    trendChange: 15,             // not > 30
    competitorPriceChange: -8,   // |-8| > 5 → PRICE_PRESSURE +15
    profitMargin: 18,            // < 20 → LOW_MARGIN +10
    supplierCountry: 'Colombia',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 15 }, { day: 'D2', sales: 15 }, { day: 'D3', sales: 14 },
      { day: 'D4', sales: 14 }, { day: 'D5', sales: 13 }, { day: 'D6', sales: 12 },
      { day: 'D7', sales: 12 }, { day: 'D8', sales: 11 }, { day: 'D9', sales: 10 },
      { day: 'D10', sales: 10 }, { day: 'D11', sales: 9 }, { day: 'D12', sales: 10 },
      { day: 'D13', sales: 9 }, { day: 'D14', sales: 9 },
    ],
  },

  {
    id: 'prod_002',
    name: 'FastCharge Pro USB-C Hub',
    category: 'Electronics',
    price: 49.99,
    previousPrice: 44.99,
    currentStock: 200,
    avgDailySales: 8,            // daysUntilStockout = 200/8 = 25
    supplierLeadTimeDays: 14,    // 25 > 14 → no stockout risk
    salesChange7d: 5,            // not < -15
    trendChange: 45,             // > 30 but salesChange7d is positive → no divergence penalty
    competitorPriceChange: 2,    // |2| < 5 → no price pressure
    profitMargin: 35,            // >= 20
    supplierCountry: 'China',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 7 }, { day: 'D2', sales: 7 }, { day: 'D3', sales: 8 },
      { day: 'D4', sales: 7 }, { day: 'D5', sales: 8 }, { day: 'D6', sales: 9 },
      { day: 'D7', sales: 8 }, { day: 'D8', sales: 8 }, { day: 'D9', sales: 9 },
      { day: 'D10', sales: 8 }, { day: 'D11', sales: 9 }, { day: 'D12', sales: 8 },
      { day: 'D13', sales: 9 }, { day: 'D14', sales: 9 },
    ],
  },

  {
    id: 'prod_003',
    name: 'GlowUp Vitamin C Serum',
    category: 'Beauty',
    price: 34.99,
    previousPrice: 39.99,
    currentStock: 30,
    avgDailySales: 15,           // daysUntilStockout = 30/15 = 2
    supplierLeadTimeDays: 10,    // 2 < 10 → STOCKOUT_RISK +30
    salesChange7d: -18,          // < -15 → SALES_DROP +25
    trendChange: 35,             // > 30 AND salesChange7d < 0 → TREND_DIVERGENCE +20
    competitorPriceChange: -6,   // |-6| > 5 → PRICE_PRESSURE +15
    profitMargin: 25,            // >= 20
    supplierCountry: 'South Korea',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 18 }, { day: 'D2', sales: 18 }, { day: 'D3', sales: 17 },
      { day: 'D4', sales: 17 }, { day: 'D5', sales: 16 }, { day: 'D6', sales: 16 },
      { day: 'D7', sales: 15 }, { day: 'D8', sales: 14 }, { day: 'D9', sales: 14 },
      { day: 'D10', sales: 13 }, { day: 'D11', sales: 13 }, { day: 'D12', sales: 12 },
      { day: 'D13', sales: 12 }, { day: 'D14', sales: 11 },
    ],
  },

  {
    id: 'prod_004',
    name: 'FlexFit Resistance Band Set',
    category: 'Sports',
    price: 29.99,
    previousPrice: 29.99,
    currentStock: 150,
    avgDailySales: 10,           // daysUntilStockout = 150/10 = 15
    supplierLeadTimeDays: 5,     // 15 > 5 → no stockout risk
    salesChange7d: -5,           // not < -15
    trendChange: 20,             // not > 30
    competitorPriceChange: 3,    // |3| < 5 → no price pressure
    profitMargin: 42,            // >= 20
    supplierCountry: 'Vietnam',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 11 }, { day: 'D2', sales: 10 }, { day: 'D3', sales: 11 },
      { day: 'D4', sales: 10 }, { day: 'D5', sales: 10 }, { day: 'D6', sales: 10 },
      { day: 'D7', sales: 9 }, { day: 'D8', sales: 10 }, { day: 'D9', sales: 10 },
      { day: 'D10', sales: 9 }, { day: 'D11', sales: 10 }, { day: 'D12', sales: 10 },
      { day: 'D13', sales: 9 }, { day: 'D14', sales: 10 },
    ],
  },

  {
    id: 'prod_005',
    name: 'CozyNest Air Purifier',
    category: 'Home',
    price: 89.99,
    previousPrice: 99.99,
    currentStock: 20,
    avgDailySales: 6,            // daysUntilStockout = 20/6 = 3.3
    supplierLeadTimeDays: 21,    // 3.3 < 21 → STOCKOUT_RISK +30
    salesChange7d: -10,          // not < -15
    trendChange: 10,             // not > 30
    competitorPriceChange: -9,   // |-9| > 5 → PRICE_PRESSURE +15
    profitMargin: 15,            // < 20 → LOW_MARGIN +10
    supplierCountry: 'China',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 7 }, { day: 'D2', sales: 7 }, { day: 'D3', sales: 6 },
      { day: 'D4', sales: 7 }, { day: 'D5', sales: 6 }, { day: 'D6', sales: 6 },
      { day: 'D7', sales: 5 }, { day: 'D8', sales: 6 }, { day: 'D9', sales: 5 },
      { day: 'D10', sales: 5 }, { day: 'D11', sales: 6 }, { day: 'D12', sales: 5 },
      { day: 'D13', sales: 5 }, { day: 'D14', sales: 6 },
    ],
  },

  {
    id: 'prod_006',
    name: 'UrbanEdge Slim Fit Chinos',
    category: 'Fashion',
    price: 59.99,
    previousPrice: 69.99,
    currentStock: 80,
    avgDailySales: 5,            // daysUntilStockout = 80/5 = 16
    supplierLeadTimeDays: 30,    // 16 < 30 → STOCKOUT_RISK +30
    salesChange7d: -20,          // < -15 → SALES_DROP +25
    trendChange: 40,             // > 30 AND salesChange7d < 0 → TREND_DIVERGENCE +20
    competitorPriceChange: -7,   // |-7| > 5 → PRICE_PRESSURE +15
    profitMargin: 38,            // >= 20
    supplierCountry: 'Bangladesh',
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 7 }, { day: 'D2', sales: 7 }, { day: 'D3', sales: 6 },
      { day: 'D4', sales: 7 }, { day: 'D5', sales: 6 }, { day: 'D6', sales: 5 },
      { day: 'D7', sales: 5 }, { day: 'D8', sales: 5 }, { day: 'D9', sales: 4 },
      { day: 'D10', sales: 5 }, { day: 'D11', sales: 4 }, { day: 'D12', sales: 4 },
      { day: 'D13', sales: 5 }, { day: 'D14', sales: 4 },
    ],
  },
];
