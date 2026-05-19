import { Router } from 'express';
import { listPricingRecommendations, getPricingRecommendation } from '../controllers/pricingController.js';

const router = Router();
router.get('/recommendations', listPricingRecommendations);
router.get('/recommendations/:id', getPricingRecommendation);

export default router;
