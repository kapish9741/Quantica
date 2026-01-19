
import express from 'express';
import { registerCA, getDashboardData, getTasks, submitTask, submitReferral } from '../controllers/caController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerCA);
// Use existing auth login, but ensure frontend handles redirection based on role usually
// Or add specific CA login if needed separately, but shared login is cleaner.

router.get('/me', authenticateToken, getDashboardData);
router.get('/tasks', authenticateToken, getTasks);
router.post('/tasks/:taskId/submit', authenticateToken, submitTask);
router.post('/referrals', authenticateToken, submitReferral);

export default router;
