
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { name, game, date, slug, status } = req.body;
        const event = await prisma.event.create({
            data: { name, game, date, slug, status }
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.update({
            where: { id: id as string },
            data: req.body
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({ where: { id: id as string } });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
};
