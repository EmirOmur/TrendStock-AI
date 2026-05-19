import { getAgentLogs } from '../services/agentService.js';

export function listAgentLogs(req, res) {
  try {
    const { agentId, priority, productId } = req.query;
    const result = getAgentLogs({ agentId, priority, productId });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[agentController]', err);
    res.status(500).json({ success: false, error: 'Failed to load agent logs' });
  }
}
