
import express from 'express';
import { getRoadmap, createRoadmapItem, deleteRoadmapItem } from '../controllers/roadmapController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getRoadmap);
router.post('/', authenticateToken, createRoadmapItem);
router.delete('/:id', authenticateToken, deleteRoadmapItem);

export default router;
