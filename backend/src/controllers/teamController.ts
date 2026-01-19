
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.query;
        const teams = await prisma.team.findMany({
            where: eventId ? { eventId: eventId as string } : {},
            orderBy: { rank: 'asc' },
            include: { participants: true } // Include participants for full data
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams' });
    }
};

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, eventId } = req.body;
        const team = await prisma.team.create({
            data: { name, eventId }
        });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Error creating team' });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const team = await prisma.team.update({
            where: { id: id as string },
            data: req.body
        });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Error updating team' });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Cascade delete manually if not handled by Prisma/DB relations effectively (MongoDB relations differ)
        // Deleting participants first
        await prisma.participant.deleteMany({ where: { teamId: id as string } });
        // Deleting match scores
        await prisma.matchScore.deleteMany({ where: { teamId: id as string } });

        // Finally delete team
        await prisma.team.delete({ where: { id: id as string } });

        res.json({ message: 'Team and related data deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting team' });
    }
};
