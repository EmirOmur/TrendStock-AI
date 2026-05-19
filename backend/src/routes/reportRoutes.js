import { Router } from 'express';
import { getReport } from '../controllers/reportController.js';

const router = Router();
router.get('/weekly', getReport);

export default router;
