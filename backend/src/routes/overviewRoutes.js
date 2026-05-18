import { Router } from 'express';
import { getOverview } from '../controllers/overviewController.js';

const router = Router();

// GET /api/overview
router.get('/', getOverview);

export default router;
