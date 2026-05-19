import { Router } from 'express';
import { listAgentLogs } from '../controllers/agentController.js';

const router = Router();
router.get('/logs', listAgentLogs);

export default router;
