import { mockSalesHistory, salesHistoryByProduct } from '../data/mockSalesHistory.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';

/**
 * GET /api/sales-history
 * Returns full flat sales history for all tracked products.
 */
export const getAllSalesHistory = (req, res) => {
  try {
    res.json(formatSuccess(mockSalesHistory));
  } catch (err) {
    console.error('[salesHistoryController] getAllSalesHistory error:', err);
    res.status(500).json(formatError('Failed to retrieve sales history'));
  }
};

/**
 * GET /api/sales-history/:productId
 * Returns 14-day sales history for a specific product.
 */
export const getSalesHistoryByProduct = (req, res) => {
  try {
    const { productId } = req.params;
    const history = salesHistoryByProduct[productId];

    if (!history) {
      return res.status(404).json(formatError(`No sales history found for product: ${productId}`));
    }

    res.json(formatSuccess(history));
  } catch (err) {
    console.error('[salesHistoryController] getSalesHistoryByProduct error:', err);
    res.status(500).json(formatError('Failed to retrieve product sales history'));
  }
};
