
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const generateReferralCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CA_${cleanName}${uniqueSuffix}`;
};

export const registerCA = async (req: Request, res: Response) => {
    const { name, email, password, college, year, phone } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const referralCode = generateReferralCode(name);

        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'ca',
                },
            });

            const ca = await prisma.campusAmbassador.create({
                data: {
                    userId: user.id,
                    college,
                    year,
                    phone,
                    referralCode,
                },
            });

            return { user, ca };
        });

        const token = jwt.sign({ userId: result.user.id, role: 'ca' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: result.user.id, email: result.user.email, role: 'ca' },
            ca: result.ca
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getDashboardData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    try {
        const ca = await prisma.campusAmbassador.findUnique({
            where: { userId },
            include: {
                submissions: true,
                referrals: true,
            }
        });

        if (!ca) {
            return res.status(404).json({ message: 'Campus Ambassador profile not found' });
        }

        // Calculate rank (simplified for now)
        const allCas = await prisma.campusAmbassador.findMany({
            orderBy: { tokens: 'desc' },
            select: { id: true }
        });
        const rank = allCas.findIndex(c => c.id === ca.id) + 1;

        res.json({
            ...ca,
            rank
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { status: 'active' }, // Show only active tasks, or show all with status
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const submitTask = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { taskId } = req.params;
    const { proofUrl } = req.body;

    try {
        const ca = await prisma.campusAmbassador.findUnique({ where: { userId } });
        if (!ca) return res.status(404).json({ message: 'CA profile not found' });

        // Check if already submitted
        const existing = await prisma.taskSubmission.findFirst({
            where: { caId: ca.id, taskId: String(taskId) }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already submitted this task' });
        }

        const submission = await prisma.taskSubmission.create({
            data: {
                taskId: String(taskId),
                caId: ca.id,
                proofUrl,
            }
        });

        res.status(201).json(submission);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const submitReferral = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { userEmail, proofUrl } = req.body;

    try {
        const ca = await prisma.campusAmbassador.findUnique({ where: { userId } });
        if (!ca) return res.status(404).json({ message: 'CA profile not found' });

        const referral = await prisma.referral.create({
            data: {
                caId: ca.id,
                userEmail,
                proofUrl,
            }
        });

        res.status(201).json(referral);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
