
import express from 'express';
import { login, verifyToken, seedAdmin } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.post('/seed', seedAdmin); // Use ideally only once

export default router;
