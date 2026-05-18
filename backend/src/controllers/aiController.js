import { analyzeWithGemini } from '../services/geminiService.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';

/**
 * POST /api/ai/analyze-product
 * Body: { product: Object, riskMetrics: Object }
 *
 * Sends the product and its pre-calculated risk metrics to Gemini.
 * Returns a structured JSON analysis with explanations and recommended actions.
 */
export const analyzeProduct = async (req, res) => {
  const { product, riskMetrics } = req.body;

  if (!product || !riskMetrics) {
    return res.status(400).json(formatError('Request body must include both "product" and "riskMetrics"'));
  }

  try {
    const analysis = await analyzeWithGemini(product, riskMetrics);
    res.json(formatSuccess(analysis));
  } catch (error) {
    console.error('[aiController] Gemini analysis failed:', error.message);
    res.status(500).json(formatError(`AI analysis failed: ${error.message}`));
  }
};
