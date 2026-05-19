import { Router } from 'express';
import { listFintechOffers, getFintechOffer } from '../controllers/fintechController.js';

const router = Router();
router.get('/offers', listFintechOffers);
router.get('/offers/:id', getFintechOffer);

export default router;
