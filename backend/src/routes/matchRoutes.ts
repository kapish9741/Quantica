
import express from 'express';
import { getMatches, createMatch, updateMatch, deleteMatch, updateMatchScore } from '../controllers/matchController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getMatches);
router.post('/', authenticateToken, createMatch);
router.put('/:id', authenticateToken, updateMatch);
router.put('/:id/score', authenticateToken, updateMatchScore); // Specific endpoint for scoring
router.delete('/:id', authenticateToken, deleteMatch);

export default router;
