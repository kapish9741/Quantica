
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import caRoutes from './routes/caRoutes';
import adminRoutes from './routes/adminRoutes';
import eventRoutes from './routes/eventRoutes';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import pointsSchemeRoutes from './routes/pointsSchemeRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/points-schemes', pointsSchemeRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Quantica API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
