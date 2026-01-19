
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPointsScheme = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.query;
        if (!eventId) return res.status(400).json({ message: 'Event ID required' });

        const scheme = await prisma.pointsScheme.findFirst({
            where: { eventId: eventId as string }
        });
        res.json(scheme || null);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching points scheme' });
    }
};

export const savePointsScheme = async (req: Request, res: Response) => {
    try {
        const { eventId, killPoints, placementPoints } = req.body;

        // Upsert logic
        const scheme = await prisma.pointsScheme.findFirst({ where: { eventId } });

        if (scheme) {
            const updated = await prisma.pointsScheme.update({
                where: { id: scheme.id },
                data: { killPoints, placementPoints }
            });
            res.json(updated);
        } else {
            const created = await prisma.pointsScheme.create({
                data: { eventId, killPoints, placementPoints }
            });
            res.json(created);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving points scheme' });
    }
};
