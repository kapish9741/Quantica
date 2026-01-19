
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const verifyAdmin = async (req: AuthRequest, res: Response, next: any) => {
    // Basic check - in production you might want more robust role checks
    // Currently, we're relying on the 'role' field on User model
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

export const createTask = async (req: Request, res: Response) => {
    const { title, description, instructions, points, deadline, type } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                instructions,
                points,
                deadline: deadline ? new Date(deadline) : null,
                type,
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSubmissions = async (req: Request, res: Response) => {
    const { status } = req.query;

    try {
        const submissions = await prisma.taskSubmission.findMany({
            where: status ? { status: String(status) } : {},
            include: {
                task: true,
                mbassador: {
                    include: { user: { select: { email: true, id: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReferrals = async (req: Request, res: Response) => {
    const { status } = req.query;

    try {
        const referrals = await prisma.referral.findMany({
            where: status ? { status: String(status) } : {},
            include: {
                mbassador: {
                    include: { user: { select: { email: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(referrals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyTaskSubmission = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const { status, reason } = req.body; // status: 'approved' | 'rejected'

    try {
        const submission = await prisma.taskSubmission.findUnique({
            where: { id: String(submissionId) },
            include: { task: true }
        });

        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        if (submission.status !== 'pending') return res.status(400).json({ message: 'Already processed' });

        await prisma.$transaction(async (prisma) => {
            await prisma.taskSubmission.update({
                where: { id: String(submissionId) },
                data: {
                    status,
                    rejectionReason: reason
                }
            });

            if (status === 'approved') {
                await prisma.campusAmbassador.update({
                    where: { id: submission.caId },
                    data: {
                        tokens: { increment: submission.task.points }
                    }
                });
            }
        });

        res.json({ message: `Submission ${status}` });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyReferral = async (req: Request, res: Response) => {
    const { referralId } = req.params;
    const { status, reason } = req.body;

    try {
        const referral = await prisma.referral.findUnique({ where: { id: String(referralId) } });
        if (!referral) return res.status(404).json({ message: 'Referral not found' });
        if (referral.status !== 'pending') return res.status(400).json({ message: 'Already processed' });

        await prisma.$transaction(async (prisma) => {
            await prisma.referral.update({
                where: { id: String(referralId) },
                data: {
                    status,
                    rejectionReason: reason
                }
            });

            if (status === 'approved') {
                // Award 50 tokens for approved referral
                await prisma.campusAmbassador.update({
                    where: { id: referral.caId },
                    data: {
                        tokens: { increment: 50 }
                    }
                });
            }
        });

        res.json({ message: `Referral ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const leaderboard = await prisma.campusAmbassador.findMany({
            include: {
                user: { select: { email: true, id: true } },
                referrals: { select: { id: true } }
            },
            orderBy: { tokens: 'desc' }
        });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
