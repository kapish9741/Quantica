
import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getEvents);
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
