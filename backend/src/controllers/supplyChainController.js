import { getSupplyChainRisks, getSupplyChainRiskById } from '../services/supplyChainService.js';

export function listSupplyChainRisks(req, res) {
  try {
    const { severity, category, sourceType } = req.query;
    const result = getSupplyChainRisks({ severity, category, sourceType });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[supplyChainController]', err);
    res.status(500).json({ success: false, error: 'Failed to load supply chain risks' });
  }
}

export function getSupplyChainRisk(req, res) {
  try {
    const item = getSupplyChainRiskById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Supply chain risk not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load supply chain risk' });
  }
}
