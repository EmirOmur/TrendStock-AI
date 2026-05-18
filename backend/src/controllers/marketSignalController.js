import { mockMarketSignals } from '../data/mockMarketSignals.js';
import { formatSuccess } from '../utils/responseFormatter.js';

/** GET /api/market-signals — returns all mock market signals */
export const getMarketSignals = (req, res) => {
  res.json(formatSuccess(mockMarketSignals));
};
