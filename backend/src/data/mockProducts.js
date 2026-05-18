// Mock product catalog — 18 products across 10 categories.
// Covers every risk scenario for demo purposes.
//
// Score legend (see riskService.js):
//   SALES_DROP      salesChange7d < -15      +25
//   STOCKOUT_RISK   daysUntilStockout < lead  +30
//   PRICE_PRESSURE  |competitorPriceChange| > 5  +15
//   TREND_DIVERGENCE trendChange > 30 && salesChange < 0  +20
//   LOW_MARGIN      profitMargin < 20         +10
//   max capped at 100

export const mockProducts = [
  // ── HIGH RISK ─────────────────────────────────────────────────────────────

  {
    id: 'prod_001',
    name: 'BeanBliss Espresso Blend',
    category: 'Coffee',
    price: 24.99,
    previousPrice: 24.99,
    currentStock: 45,
    avgDailySales: 12,           // daysUntilStockout = 3.75 < 7  → +30
    supplierLeadTimeDays: 7,
    salesChange7d: -22,          // < -15  → +25
    trendChange: 15,
    competitorPriceChange: -8,   // |-8| > 5  → +15
    profitMargin: 18,            // < 20  → +10   TOTAL: 80
    supplierCountry: 'Colombia',
    revenue7d: 2099,
    unitsSold7d: 84,
    returnRate: 2.1,
    rating: 3.9,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 15 }, { day: 'D2', sales: 15 }, { day: 'D3', sales: 14 },
      { day: 'D4', sales: 14 }, { day: 'D5', sales: 13 }, { day: 'D6', sales: 12 },
      { day: 'D7', sales: 12 }, { day: 'D8', sales: 11 }, { day: 'D9', sales: 10 },
      { day: 'D10', sales: 10 }, { day: 'D11', sales: 9 }, { day: 'D12', sales: 10 },
      { day: 'D13', sales: 9 },  { day: 'D14', sales: 9 },
    ],
  },

  {
    id: 'prod_003',
    name: 'GlowUp Vitamin C Serum',
    category: 'Beauty',
    price: 34.99,
    previousPrice: 39.99,
    currentStock: 30,
    avgDailySales: 15,           // daysUntilStockout = 2 < 10  → +30
    supplierLeadTimeDays: 10,
    salesChange7d: -18,          // < -15  → +25
    trendChange: 35,             // > 30 & sales < 0  → +20
    competitorPriceChange: -6,   // |-6| > 5  → +15   TOTAL: 90
    profitMargin: 25,
    supplierCountry: 'South Korea',
    revenue7d: 3674,
    unitsSold7d: 105,
    returnRate: 1.8,
    rating: 4.0,
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
    id: 'prod_006',
    name: 'UrbanEdge Slim Fit Chinos',
    category: 'Fashion',
    price: 59.99,
    previousPrice: 69.99,
    currentStock: 80,
    avgDailySales: 5,            // daysUntilStockout = 16 < 30  → +30
    supplierLeadTimeDays: 30,
    salesChange7d: -20,          // < -15  → +25
    trendChange: 40,             // > 30 & sales < 0  → +20
    competitorPriceChange: -7,   // |-7| > 5  → +15   TOTAL: 90
    profitMargin: 38,
    supplierCountry: 'Bangladesh',
    revenue7d: 2100,
    unitsSold7d: 35,
    returnRate: 6.2,
    rating: 3.6,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 7 }, { day: 'D2', sales: 7 }, { day: 'D3', sales: 6 },
      { day: 'D4', sales: 7 }, { day: 'D5', sales: 6 }, { day: 'D6', sales: 5 },
      { day: 'D7', sales: 5 }, { day: 'D8', sales: 5 }, { day: 'D9', sales: 4 },
      { day: 'D10', sales: 5 }, { day: 'D11', sales: 4 }, { day: 'D12', sales: 4 },
      { day: 'D13', sales: 5 }, { day: 'D14', sales: 4 },
    ],
  },

  {
    id: 'prod_008',
    name: 'ProGamer X1 Wireless Mouse',
    category: 'Gaming',
    price: 79.99,
    previousPrice: 84.99,
    currentStock: 25,
    avgDailySales: 8,            // daysUntilStockout = 3.1 < 14  → +30
    supplierLeadTimeDays: 14,
    salesChange7d: -20,          // < -15  → +25
    trendChange: 65,             // > 30 & sales < 0  → +20
    competitorPriceChange: -10,  // |-10| > 5  → +15   TOTAL: 90
    profitMargin: 22,
    supplierCountry: 'China',
    revenue7d: 4479,
    unitsSold7d: 56,
    returnRate: 4.2,
    rating: 3.8,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 12 }, { day: 'D2', sales: 11 }, { day: 'D3', sales: 11 },
      { day: 'D4', sales: 10 }, { day: 'D5', sales: 10 }, { day: 'D6', sales: 9 },
      { day: 'D7', sales: 9 },  { day: 'D8', sales: 8 },  { day: 'D9', sales: 8 },
      { day: 'D10', sales: 7 }, { day: 'D11', sales: 7 },  { day: 'D12', sales: 8 },
      { day: 'D13', sales: 7 }, { day: 'D14', sales: 7 },
    ],
  },

  {
    id: 'prod_011',
    name: 'ErgoRise Pro Standing Desk',
    category: 'Office',
    price: 349.99,
    previousPrice: 379.99,
    currentStock: 15,
    avgDailySales: 3,            // daysUntilStockout = 5 < 21  → +30
    supplierLeadTimeDays: 21,
    salesChange7d: -20,          // < -15  → +25
    trendChange: 55,             // > 30 & sales < 0  → +20
    competitorPriceChange: -8,   // |-8| > 5  → +15   TOTAL: 90
    profitMargin: 32,
    supplierCountry: 'China',
    revenue7d: 7350,
    unitsSold7d: 21,
    returnRate: 3.5,
    rating: 4.2,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 5 }, { day: 'D2', sales: 4 }, { day: 'D3', sales: 5 },
      { day: 'D4', sales: 4 }, { day: 'D5', sales: 4 }, { day: 'D6', sales: 3 },
      { day: 'D7', sales: 3 }, { day: 'D8', sales: 3 }, { day: 'D9', sales: 3 },
      { day: 'D10', sales: 3 }, { day: 'D11', sales: 2 }, { day: 'D12', sales: 3 },
      { day: 'D13', sales: 2 }, { day: 'D14', sales: 2 },
    ],
  },

  {
    id: 'prod_016',
    name: 'TacticalKeys Mech Keyboard',
    category: 'Gaming',
    price: 119.99,
    previousPrice: 129.99,
    currentStock: 30,
    avgDailySales: 6,            // daysUntilStockout = 5 < 21  → +30
    supplierLeadTimeDays: 21,
    salesChange7d: -17,          // < -15  → +25
    trendChange: 50,             // > 30 & sales < 0  → +20
    competitorPriceChange: -9,   // |-9| > 5  → +15
    profitMargin: 18,            // < 20  → +10   TOTAL: 100 (capped)
    supplierCountry: 'China',
    revenue7d: 5040,
    unitsSold7d: 42,
    returnRate: 5.1,
    rating: 3.7,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 9 },  { day: 'D2', sales: 9 },  { day: 'D3', sales: 8 },
      { day: 'D4', sales: 8 },  { day: 'D5', sales: 7 },  { day: 'D6', sales: 7 },
      { day: 'D7', sales: 7 },  { day: 'D8', sales: 6 },  { day: 'D9', sales: 6 },
      { day: 'D10', sales: 5 }, { day: 'D11', sales: 6 }, { day: 'D12', sales: 5 },
      { day: 'D13', sales: 5 }, { day: 'D14', sales: 5 },
    ],
  },

  // ── MEDIUM RISK ───────────────────────────────────────────────────────────

  {
    id: 'prod_005',
    name: 'CozyNest Air Purifier',
    category: 'Home',
    price: 89.99,
    previousPrice: 99.99,
    currentStock: 20,
    avgDailySales: 6,            // daysUntilStockout = 3.3 < 21  → +30
    supplierLeadTimeDays: 21,
    salesChange7d: -10,
    trendChange: 10,
    competitorPriceChange: -9,   // |-9| > 5  → +15
    profitMargin: 15,            // < 20  → +10   TOTAL: 55
    supplierCountry: 'China',
    revenue7d: 3780,
    unitsSold7d: 42,
    returnRate: 3.2,
    rating: 4.1,
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
    id: 'prod_010',
    name: 'PuppyPal Grain-Free Dog Food',
    category: 'Pet Supplies',
    price: 54.99,
    previousPrice: 54.99,
    currentStock: 80,
    avgDailySales: 8,            // daysUntilStockout = 10 < 14  → +30
    supplierLeadTimeDays: 14,
    salesChange7d: -5,
    trendChange: 20,
    competitorPriceChange: -6,   // |-6| > 5  → +15   TOTAL: 45
    profitMargin: 22,
    supplierCountry: 'USA',
    revenue7d: 3079,
    unitsSold7d: 56,
    returnRate: 2.1,
    rating: 4.3,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 9 },  { day: 'D2', sales: 9 },  { day: 'D3', sales: 8 },
      { day: 'D4', sales: 8 },  { day: 'D5', sales: 8 },  { day: 'D6', sales: 8 },
      { day: 'D7', sales: 8 },  { day: 'D8', sales: 8 },  { day: 'D9', sales: 7 },
      { day: 'D10', sales: 8 }, { day: 'D11', sales: 7 }, { day: 'D12', sales: 8 },
      { day: 'D13', sales: 7 }, { day: 'D14', sales: 7 },
    ],
  },

  {
    id: 'prod_012',
    name: 'SoundWave Pro Headphones',
    category: 'Electronics',
    price: 129.99,
    previousPrice: 139.99,
    currentStock: 55,
    avgDailySales: 7,            // daysUntilStockout = 7.9 < 21  → +30
    supplierLeadTimeDays: 21,
    salesChange7d: -8,
    trendChange: 28,
    competitorPriceChange: -6,   // |-6| > 5  → +15   TOTAL: 45
    profitMargin: 30,
    supplierCountry: 'China',
    revenue7d: 6370,
    unitsSold7d: 49,
    returnRate: 2.8,
    rating: 4.1,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 9 },  { day: 'D2', sales: 8 },  { day: 'D3', sales: 8 },
      { day: 'D4', sales: 8 },  { day: 'D5', sales: 8 },  { day: 'D6', sales: 7 },
      { day: 'D7', sales: 7 },  { day: 'D8', sales: 7 },  { day: 'D9', sales: 7 },
      { day: 'D10', sales: 7 }, { day: 'D11', sales: 6 }, { day: 'D12', sales: 7 },
      { day: 'D13', sales: 7 }, { day: 'D14', sales: 6 },
    ],
  },

  {
    id: 'prod_013',
    name: 'LuminaGlow Face Moisturizer',
    category: 'Beauty',
    price: 28.99,
    previousPrice: 28.99,
    currentStock: 90,
    avgDailySales: 12,           // daysUntilStockout = 7.5 < 10  → +30
    supplierLeadTimeDays: 10,
    salesChange7d: -5,
    trendChange: 22,
    competitorPriceChange: -7,   // |-7| > 5  → +15   TOTAL: 45
    profitMargin: 28,
    supplierCountry: 'South Korea',
    revenue7d: 2435,
    unitsSold7d: 84,
    returnRate: 1.5,
    rating: 4.5,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 13 }, { day: 'D2', sales: 13 }, { day: 'D3', sales: 12 },
      { day: 'D4', sales: 12 }, { day: 'D5', sales: 12 }, { day: 'D6', sales: 12 },
      { day: 'D7', sales: 12 }, { day: 'D8', sales: 12 }, { day: 'D9', sales: 11 },
      { day: 'D10', sales: 12 }, { day: 'D11', sales: 11 }, { day: 'D12', sales: 12 },
      { day: 'D13', sales: 11 }, { day: 'D14', sales: 11 },
    ],
  },

  {
    id: 'prod_015',
    name: 'SmartStrip 6-Port Power Bar',
    category: 'Home',
    price: 32.99,
    previousPrice: 34.99,
    currentStock: 45,
    avgDailySales: 8,            // daysUntilStockout = 5.6 < 14  → +30
    supplierLeadTimeDays: 14,
    salesChange7d: -5,
    trendChange: 20,
    competitorPriceChange: -7,   // |-7| > 5  → +15   TOTAL: 45
    profitMargin: 24,
    supplierCountry: 'China',
    revenue7d: 1847,
    unitsSold7d: 56,
    returnRate: 2.3,
    rating: 4.0,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 9 },  { day: 'D2', sales: 9 },  { day: 'D3', sales: 9 },
      { day: 'D4', sales: 8 },  { day: 'D5', sales: 8 },  { day: 'D6', sales: 8 },
      { day: 'D7', sales: 8 },  { day: 'D8', sales: 8 },  { day: 'D9', sales: 8 },
      { day: 'D10', sales: 7 }, { day: 'D11', sales: 8 }, { day: 'D12', sales: 7 },
      { day: 'D13', sales: 8 }, { day: 'D14', sales: 7 },
    ],
  },

  {
    id: 'prod_018',
    name: 'Croft Slim Leather Wallet',
    category: 'Fashion',
    price: 44.99,
    previousPrice: 49.99,
    currentStock: 80,
    avgDailySales: 5,            // daysUntilStockout = 16 < 30  → +30
    supplierLeadTimeDays: 30,
    salesChange7d: -16,          // < -15  → +25
    trendChange: 22,
    competitorPriceChange: 2,
    profitMargin: 42,            //                    TOTAL: 55
    supplierCountry: 'Italy',
    revenue7d: 1575,
    unitsSold7d: 35,
    returnRate: 1.8,
    rating: 4.4,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 7 },  { day: 'D2', sales: 6 },  { day: 'D3', sales: 6 },
      { day: 'D4', sales: 6 },  { day: 'D5', sales: 6 },  { day: 'D6', sales: 5 },
      { day: 'D7', sales: 5 },  { day: 'D8', sales: 5 },  { day: 'D9', sales: 5 },
      { day: 'D10', sales: 5 }, { day: 'D11', sales: 4 }, { day: 'D12', sales: 5 },
      { day: 'D13', sales: 4 }, { day: 'D14', sales: 4 },
    ],
  },

  // ── LOW RISK ──────────────────────────────────────────────────────────────

  {
    id: 'prod_002',
    name: 'FastCharge Pro USB-C Hub',
    category: 'Electronics',
    price: 49.99,
    previousPrice: 44.99,
    currentStock: 200,
    avgDailySales: 8,            // daysUntilStockout = 25 > 14
    supplierLeadTimeDays: 14,
    salesChange7d: 5,
    trendChange: 45,             // > 30 but sales positive → no divergence
    competitorPriceChange: 2,
    profitMargin: 35,            // TOTAL: 0
    supplierCountry: 'China',
    revenue7d: 2799,
    unitsSold7d: 56,
    returnRate: 1.4,
    rating: 4.6,
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
    id: 'prod_004',
    name: 'FlexFit Resistance Band Set',
    category: 'Sports',
    price: 29.99,
    previousPrice: 29.99,
    currentStock: 150,
    avgDailySales: 10,           // daysUntilStockout = 15 > 5
    supplierLeadTimeDays: 5,
    salesChange7d: -5,
    trendChange: 20,
    competitorPriceChange: 3,
    profitMargin: 42,            // TOTAL: 0
    supplierCountry: 'Vietnam',
    revenue7d: 2099,
    unitsSold7d: 70,
    returnRate: 0.9,
    rating: 4.7,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 11 }, { day: 'D2', sales: 10 }, { day: 'D3', sales: 11 },
      { day: 'D4', sales: 10 }, { day: 'D5', sales: 10 }, { day: 'D6', sales: 10 },
      { day: 'D7', sales: 9 },  { day: 'D8', sales: 10 }, { day: 'D9', sales: 10 },
      { day: 'D10', sales: 9 }, { day: 'D11', sales: 10 }, { day: 'D12', sales: 10 },
      { day: 'D13', sales: 9 }, { day: 'D14', sales: 10 },
    ],
  },

  {
    id: 'prod_007',
    name: 'BrewMaster Cold Brew Concentrate',
    category: 'Coffee',
    price: 19.99,
    previousPrice: 19.99,
    currentStock: 180,
    avgDailySales: 15,           // daysUntilStockout = 12 > 5
    supplierLeadTimeDays: 5,
    salesChange7d: 8,
    trendChange: 25,
    competitorPriceChange: 2,
    profitMargin: 32,            // TOTAL: 0
    supplierCountry: 'USA',
    revenue7d: 2099,
    unitsSold7d: 105,
    returnRate: 1.2,
    rating: 4.7,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 13 }, { day: 'D2', sales: 13 }, { day: 'D3', sales: 14 },
      { day: 'D4', sales: 14 }, { day: 'D5', sales: 15 }, { day: 'D6', sales: 15 },
      { day: 'D7', sales: 15 }, { day: 'D8', sales: 15 }, { day: 'D9', sales: 16 },
      { day: 'D10', sales: 16 }, { day: 'D11', sales: 16 }, { day: 'D12', sales: 15 },
      { day: 'D13', sales: 16 }, { day: 'D14', sales: 17 },
    ],
  },

  {
    id: 'prod_009',
    name: 'NutriPeak Protein Bar Pack',
    category: 'Grocery',
    price: 34.99,
    previousPrice: 34.99,
    currentStock: 450,
    avgDailySales: 25,           // daysUntilStockout = 18 > 3
    supplierLeadTimeDays: 3,
    salesChange7d: 12,
    trendChange: 18,
    competitorPriceChange: 1,
    profitMargin: 28,            // TOTAL: 0
    supplierCountry: 'USA',
    revenue7d: 6123,
    unitsSold7d: 175,
    returnRate: 0.8,
    rating: 4.6,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 22 }, { day: 'D2', sales: 23 }, { day: 'D3', sales: 23 },
      { day: 'D4', sales: 24 }, { day: 'D5', sales: 24 }, { day: 'D6', sales: 25 },
      { day: 'D7', sales: 25 }, { day: 'D8', sales: 25 }, { day: 'D9', sales: 26 },
      { day: 'D10', sales: 26 }, { day: 'D11', sales: 25 }, { day: 'D12', sales: 27 },
      { day: 'D13', sales: 26 }, { day: 'D14', sales: 27 },
    ],
  },

  {
    id: 'prod_014',
    name: 'ZenFlow Premium Yoga Mat',
    category: 'Sports',
    price: 39.99,
    previousPrice: 39.99,
    currentStock: 220,
    avgDailySales: 12,           // daysUntilStockout = 18.3 > 5
    supplierLeadTimeDays: 5,
    salesChange7d: 5,
    trendChange: 22,
    competitorPriceChange: 2,
    profitMargin: 46,            // TOTAL: 0
    supplierCountry: 'Vietnam',
    revenue7d: 3359,
    unitsSold7d: 84,
    returnRate: 1.0,
    rating: 4.8,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 11 }, { day: 'D2', sales: 11 }, { day: 'D3', sales: 12 },
      { day: 'D4', sales: 12 }, { day: 'D5', sales: 12 }, { day: 'D6', sales: 12 },
      { day: 'D7', sales: 12 }, { day: 'D8', sales: 12 }, { day: 'D9', sales: 13 },
      { day: 'D10', sales: 12 }, { day: 'D11', sales: 13 }, { day: 'D12', sales: 12 },
      { day: 'D13', sales: 13 }, { day: 'D14', sales: 13 },
    ],
  },

  {
    id: 'prod_017',
    name: 'Morning Ritual Organic Coffee',
    category: 'Coffee',
    price: 22.99,
    previousPrice: 22.99,
    currentStock: 280,
    avgDailySales: 18,           // daysUntilStockout = 15.6 > 7
    supplierLeadTimeDays: 7,
    salesChange7d: 15,
    trendChange: 20,
    competitorPriceChange: 2,
    profitMargin: 38,            // TOTAL: 0
    supplierCountry: 'Ethiopia',
    revenue7d: 2898,
    unitsSold7d: 126,
    returnRate: 0.9,
    rating: 4.9,
    imageUrl: null,
    salesHistory: [
      { day: 'D1', sales: 16 }, { day: 'D2', sales: 16 }, { day: 'D3', sales: 17 },
      { day: 'D4', sales: 17 }, { day: 'D5', sales: 17 }, { day: 'D6', sales: 18 },
      { day: 'D7', sales: 18 }, { day: 'D8', sales: 18 }, { day: 'D9', sales: 19 },
      { day: 'D10', sales: 18 }, { day: 'D11', sales: 19 }, { day: 'D12', sales: 19 },
      { day: 'D13', sales: 20 }, { day: 'D14', sales: 20 },
    ],
  },
];
