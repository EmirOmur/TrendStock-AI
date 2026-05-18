import { analyzeWithGemini } from '../services/geminiService.js';
import { generateFallbackRecommendation } from '../services/fallbackRecommendationService.js';
import { formatSuccess, formatError, formatFallback } from '../utils/responseFormatter.js';

/**
 * Detects Gemini quota / rate-limit errors from multiple possible error shapes.
 * The raw error is ONLY logged on the backend — never forwarded to the frontend.
 */
function isGeminiQuotaError(error) {
  if (error.status === 429 || error.statusCode === 429) return true;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('ratelimitexceeded') ||
    msg.includes('too many requests')
  );
}

/**
 * POST /api/ai/analyze-product
 * Body: { product: Object, riskMetrics: Object }
 *
 * On success  → HTTP 200, { success: true, data: <gemini analysis> }
 * On quota    → HTTP 200, { success: false, fallback: true, errorType: 'GEMINI_QUOTA_EXCEEDED', ... }
 * On error    → HTTP 200, { success: false, fallback: true, errorType: 'GEMINI_ERROR', ... }
 *
 * NOTE: fallback responses use HTTP 200 intentionally so Axios on the frontend
 * does not throw — the frontend reads the `fallback` flag instead.
 */
export const analyzeProduct = async (req, res) => {
  const { product, riskMetrics } = req.body;

  if (!product || !riskMetrics) {
    return res.status(400).json(formatError('Request body must include both "product" and "riskMetrics"'));
  }

  try {
    const analysis = await analyzeWithGemini(product, riskMetrics);
    return res.json(formatSuccess(analysis));
  } catch (error) {
    // ── Log full error details to backend console only ──
    console.error(
      '[aiController] Gemini error — status:',
      error.status ?? error.statusCode ?? 'unknown',
      '| message:',
      error.message
    );

    // ── Generate deterministic fallback from local risk data ──
    const fallbackRecommendation = generateFallbackRecommendation(product, riskMetrics);

    if (isGeminiQuotaError(error)) {
      return res.json(
        formatFallback(
          'GEMINI_QUOTA_EXCEEDED',
          'Gemini quota limit reached. Showing fallback recommendation generated from local risk signals.',
          fallbackRecommendation
        )
      );
    }

    return res.json(
      formatFallback(
        'GEMINI_ERROR',
        'Gemini analysis is temporarily unavailable. Showing fallback recommendation.',
        fallbackRecommendation
      )
    );
  }
};
