// Flat sales history for the forecast page — 8 key products × 14 days.
// Each record includes actual sales, predicted sales, revenue, and rolling risk score.
// Dates run from 2026-05-06 to 2026-05-19.

const DATES = [
  '05/06', '05/07', '05/08', '05/09', '05/10',
  '05/11', '05/12', '05/13', '05/14', '05/15',
  '05/16', '05/17', '05/18', '05/19',
];

// Helper to build a product's daily records
function buildHistory(productId, price, actuals, predicted, riskScores) {
  return actuals.map((units, i) => ({
    date: DATES[i],
    productId,
    unitsSold: units,
    revenue: parseFloat((units * price).toFixed(2)),
    predictedUnits: predicted[i],
    riskScore: riskScores[i],
  }));
}

export const mockSalesHistory = [
  // prod_001 — BeanBliss Espresso Blend (declining, HIGH risk)
  ...buildHistory(
    'prod_001', 24.99,
    [15, 15, 14, 14, 13, 12, 12, 11, 10, 10, 9, 10, 9, 9],
    [15, 14, 14, 13, 13, 13, 12, 12, 11, 11, 10, 10, 10, 9],
    [45, 48, 50, 52, 55, 58, 60, 63, 65, 68, 70, 72, 78, 80],
  ),

  // prod_002 — FastCharge Pro USB-C Hub (growing, LOW risk)
  ...buildHistory(
    'prod_002', 49.99,
    [7, 7, 8, 7, 8, 9, 8, 8, 9, 8, 9, 8, 9, 9],
    [7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 10],
    [5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  ),

  // prod_003 — GlowUp Vitamin C Serum (sharp decline, HIGH risk)
  ...buildHistory(
    'prod_003', 34.99,
    [18, 18, 17, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12, 11],
    [18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11],
    [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 88, 90],
  ),

  // prod_006 — UrbanEdge Slim Fit Chinos (falling sales vs rising trend)
  ...buildHistory(
    'prod_006', 59.99,
    [7, 7, 6, 7, 6, 5, 5, 5, 4, 5, 4, 4, 5, 4],
    [7, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4],
    [50, 55, 58, 60, 62, 65, 68, 70, 72, 75, 80, 85, 88, 90],
  ),

  // prod_007 — BrewMaster Cold Brew (growing nicely, LOW risk)
  ...buildHistory(
    'prod_007', 19.99,
    [13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 15, 16, 17],
    [13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16, 16, 17, 17],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),

  // prod_008 — ProGamer X1 Mouse (sharp decline, HIGH risk)
  ...buildHistory(
    'prod_008', 79.99,
    [12, 11, 11, 10, 10, 9, 9, 8, 8, 7, 7, 8, 7, 7],
    [12, 11, 11, 10, 10, 9, 9, 8, 8, 8, 7, 7, 7, 7],
    [20, 25, 30, 38, 45, 52, 58, 65, 70, 75, 80, 85, 88, 90],
  ),

  // prod_011 — ErgoRise Standing Desk (falling, HIGH risk, expensive)
  ...buildHistory(
    'prod_011', 349.99,
    [5, 4, 5, 4, 4, 3, 3, 3, 3, 3, 2, 3, 2, 2],
    [5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2],
    [25, 30, 38, 45, 52, 58, 65, 68, 72, 78, 82, 85, 88, 90],
  ),

  // prod_017 — Morning Ritual Organic Coffee (consistent growth, LOW risk)
  ...buildHistory(
    'prod_017', 22.99,
    [16, 16, 17, 17, 17, 18, 18, 18, 19, 18, 19, 19, 20, 20],
    [16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
];

// Indexed by productId for fast lookup
export const salesHistoryByProduct = mockSalesHistory.reduce((acc, record) => {
  if (!acc[record.productId]) acc[record.productId] = [];
  acc[record.productId].push(record);
  return acc;
}, {});
