import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client once at module load.
// The API key is read from environment variables — never hardcode it.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = 'gemini-2.0-flash';

/**
 * Builds the Gemini prompt for e-commerce risk analysis.
 * The prompt instructs Gemini to act as a risk analyst and return structured JSON.
 */
function buildPrompt(product, riskMetrics) {
  return `You are an expert e-commerce risk analyst with deep knowledge of supply chain management, pricing strategy, and digital marketing. Analyze the product data and risk metrics below.

Your task:
1. Explain the identified risks in plain, practical language.
2. Recommend specific, actionable business decisions the seller can take today.
3. Identify any financial or supply chain warnings.
4. Surface any trend-based opportunities if applicable.

STRICT RULES:
- Only use the data provided below. Do not invent, assume, or hallucinate any information.
- Be specific: mention actual numbers from the data in your explanation.
- Return ONLY valid JSON. No markdown code fences, no extra text before or after the JSON.
- If a field has no applicable information, set it to null.

PRODUCT DATA:
${JSON.stringify(product, null, 2)}

RISK METRICS (pre-calculated — do not recalculate):
${JSON.stringify(riskMetrics, null, 2)}

Return exactly this JSON structure:
{
  "summary": "2-3 sentence executive summary of the product's current situation and urgency level",
  "riskExplanation": "Detailed explanation of the identified risks, referencing specific numbers from the data",
  "recommendedActions": [
    {
      "action": "Specific action label (e.g., Emergency Stock Reorder, Price Reduction Campaign, Trend-Based Promotion, Bundle Offer, Supplier Negotiation)",
      "reason": "Why this action is needed right now, with specific data references",
      "expectedImpact": "Concrete, quantified or clearly described expected outcome"
    }
  ],
  "financialWarning": "Financial risk warning referencing margin and pricing data, or null if no financial risk",
  "supplyChainWarning": "Supply chain risk warning referencing stock and lead time data, or null if no supply chain risk",
  "trendOpportunity": "Specific trend-based opportunity with actionable suggestion, or null if no opportunity",
  "confidence": "LOW | MEDIUM | HIGH"
}`;
}

/**
 * Sends product + risk data to Gemini and returns a structured analysis.
 * @param {Object} product - Full product object
 * @param {Object} riskMetrics - Pre-calculated risk metrics from riskService
 * @returns {Object} Parsed Gemini JSON response
 */
export async function analyzeWithGemini(product, riskMetrics) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const prompt = buildPrompt(product, riskMetrics);

  const response = await genAI.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const rawText = response.text.trim();

  // Strip markdown code fences in case the model wraps the JSON anyway
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // If parsing fails, return a structured error so the frontend handles it gracefully
    throw new Error(`Gemini returned non-JSON response. Raw: ${rawText.slice(0, 200)}`);
  }

  return parsed;
}
