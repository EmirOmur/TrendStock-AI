import { Router } from 'express';
import { analyzeProduct } from '../controllers/aiController.js';

const router = Router();

router.post('/analyze-product', analyzeProduct);

export default router;
