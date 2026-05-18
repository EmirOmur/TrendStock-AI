import { Router } from 'express';
import { getMarketSignals } from '../controllers/marketSignalController.js';

const router = Router();
router.get('/', getMarketSignals);
export default router;
