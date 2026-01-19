
import express from 'express';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../controllers/teamController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getTeams);
router.post('/', authenticateToken, createTeam);
router.put('/:id', authenticateToken, updateTeam);
router.delete('/:id', authenticateToken, deleteTeam);

export default router;
