/**
 * Simple arithmetic forecasting utilities.
 * No ML required — these are transparent, deterministic calculations.
 */

/**
 * Estimates how many days of stock remain at the current sales velocity.
 * @param {number} currentStock
 * @param {number} avgDailySales
 * @returns {number} Days until stockout (rounded to 1 decimal)
 */
export function forecastDaysUntilStockout(currentStock, avgDailySales) {
  if (avgDailySales <= 0) return Infinity;
  return parseFloat((currentStock / avgDailySales).toFixed(1));
}

/**
 * Estimates the revenue at risk over a given window if stockout occurs.
 * @param {number} price - Unit price
 * @param {number} avgDailySales - Average units sold per day
 * @param {number} stockoutGapDays - Days without stock (lead time - days until stockout)
 * @returns {number} Estimated lost revenue
 */
export function forecastRevenueAtRisk(price, avgDailySales, stockoutGapDays) {
  if (stockoutGapDays <= 0) return 0;
  return parseFloat((price * avgDailySales * stockoutGapDays).toFixed(2));
}

/**
 * Projects future sales for N days based on a linear trend.
 * Uses the 7-day change rate to adjust the average daily sales forward.
 *
 * @param {number} avgDailySales - Current average daily sales
 * @param {number} salesChange7d - 7-day sales change as a percentage
 * @param {number} days - Number of days to forecast
 * @returns {Array<{ day: string, projected: number }>}
 */
export function forecastSales(avgDailySales, salesChange7d, days = 7) {
  const dailyChangeRate = salesChange7d / 100 / 7; // Linear daily rate from weekly change

  return Array.from({ length: days }, (_, i) => {
    const projected = Math.max(0, avgDailySales * (1 + dailyChangeRate * (i + 1)));
    return {
      day: `Day +${i + 1}`,
      projected: parseFloat(projected.toFixed(1)),
    };
  });
}

/**
 * Calculates total projected revenue at risk for all high-risk products.
 * Used for the "Revenue at Risk" metric card on the dashboard.
 *
 * @param {Array} productsWithRisk - Products with riskMetrics attached
 * @param {number} windowDays - Forecast window (default 7 days)
 * @returns {number} Total estimated revenue at risk
 */
export function calculateTotalRevenueAtRisk(productsWithRisk, windowDays = 7) {
  return productsWithRisk
    .filter((p) => p.riskMetrics?.level === 'HIGH')
    .reduce((total, p) => {
      const weeklyRevenue = p.price * p.avgDailySales * windowDays;
      // Apply the sales decline factor to estimate the at-risk portion
      const declineFactor = Math.abs(Math.min(p.salesChange7d, 0)) / 100;
      return total + weeklyRevenue * declineFactor;
    }, 0);
}
