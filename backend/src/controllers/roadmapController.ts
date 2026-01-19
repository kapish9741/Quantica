
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRoadmap = async (req: Request, res: Response) => {
    try {
        const items = await prisma.roadmapItem.findMany({ orderBy: { date: 'asc' } });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roadmap' });
    }
};

export const createRoadmapItem = async (req: Request, res: Response) => {
    try {
        const { title, description, date, status, eventId } = req.body;
        const item = await prisma.roadmapItem.create({
            data: { title, description, date, status, eventId }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating roadmap item' });
    }
};

export const deleteRoadmapItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.roadmapItem.delete({ where: { id: id as string } });
        res.json({ message: 'Roadmap item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting roadmap item' });
    }
};
