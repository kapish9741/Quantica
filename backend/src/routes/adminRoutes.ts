
import express from 'express';
import { createTask, getSubmissions, getReferrals, verifyTaskSubmission, verifyReferral, verifyAdmin, getLeaderboard } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth and admin check to all routes
router.use(authenticateToken, verifyAdmin);

router.post('/tasks', createTask);
router.get('/submissions', getSubmissions);
router.get('/referrals', getReferrals);
router.get('/leaderboard', getLeaderboard);
router.post('/submissions/:submissionId/verify', verifyTaskSubmission);
router.post('/referrals/:referralId/verify', verifyReferral);

export default router;
