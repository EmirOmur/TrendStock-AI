import { getFintechOffers, getFintechOfferById } from '../services/fintechService.js';

export function listFintechOffers(req, res) {
  try {
    const { type, riskLevel, urgency } = req.query;
    const result = getFintechOffers({ type, riskLevel, urgency });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[fintechController]', err);
    res.status(500).json({ success: false, error: 'Failed to load fintech offers' });
  }
}

export function getFintechOffer(req, res) {
  try {
    const item = getFintechOfferById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Fintech offer not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load fintech offer' });
  }
}
