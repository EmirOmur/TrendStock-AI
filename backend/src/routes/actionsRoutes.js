import { Router } from 'express';
import { mockActions } from '../data/mockActions.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: mockActions });
});

export default router;
