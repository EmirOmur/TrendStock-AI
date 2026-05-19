import { getWeeklyReport } from '../services/reportService.js';

export function getReport(req, res) {
  try {
    const report = getWeeklyReport();
    res.json({ success: true, data: report });
  } catch (err) {
    console.error('[reportController]', err);
    res.status(500).json({ success: false, error: 'Failed to load weekly report' });
  }
}
