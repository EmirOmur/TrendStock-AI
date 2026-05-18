import { Router } from 'express';
import { getAllSalesHistory, getSalesHistoryByProduct } from '../controllers/salesHistoryController.js';

const router = Router();

// GET /api/sales-history
router.get('/', getAllSalesHistory);

// GET /api/sales-history/:productId
router.get('/:productId', getSalesHistoryByProduct);

export default router;
