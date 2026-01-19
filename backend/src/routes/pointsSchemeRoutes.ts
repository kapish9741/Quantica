
import express from 'express';
import { getPointsScheme, savePointsScheme } from '../controllers/pointsSchemeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getPointsScheme);
router.post('/', authenticateToken, savePointsScheme);

export default router;
