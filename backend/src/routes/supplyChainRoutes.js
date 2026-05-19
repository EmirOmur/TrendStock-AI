import { Router } from 'express';
import { listSupplyChainRisks, getSupplyChainRisk } from '../controllers/supplyChainController.js';

const router = Router();
router.get('/risks', listSupplyChainRisks);
router.get('/risks/:id', getSupplyChainRisk);

export default router;
