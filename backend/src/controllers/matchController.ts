
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMatches = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.query;
        const matches = await prisma.match.findMany({
            where: eventId ? { eventId: eventId as string } : {},
            orderBy: { matchNumber: 'asc' },
            include: {
                scores: {
                    include: { team: true }
                }
            }
        });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching matches' });
    }
};

export const createMatch = async (req: Request, res: Response) => {
    try {
        const { eventId, matchNumber, team1Id, team2Id, scheduledDate, status } = req.body;
        const match = await prisma.match.create({
            data: {
                eventId,
                matchNumber,
                team1Id,
                team2Id,
                scheduledDate,
                status: status || 'scheduled'
            }
        });
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Error creating match' });
    }
};

export const updateMatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const match = await prisma.match.update({
            where: { id: id as string },
            data: req.body
        });
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Error updating match' });
    }
};

export const updateMatchScore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { scores, winnerTeamId } = req.body; 

        const result = await prisma.$transaction(async (tx) => {
            const updatedMatch = await tx.match.update({
                where: { id: id as string },
                data: {
                    status: 'completed',
                    winnerTeamId
                }
            });

            await tx.matchScore.deleteMany({ where: { matchId: id as string } });

            if (scores && scores.length > 0) {
                await tx.matchScore.createMany({
                    data: scores.map((s: any) => ({
                        matchId: id,
                        teamId: s.teamId,
                        placement: s.placement,
                        kills: s.kills || 0,
                        points: s.points || 0
                    }))
                });
            }

            return updatedMatch;
        }, {
            timeout: 10000
        });

        const match = await prisma.match.findUnique({ where: { id: id as string } });
        if (match) {
            await prisma.$transaction(async (tx) => {
                await recalculateLeaderboard(match.eventId, tx);
            });
        }

        console.log(`Match ${id} scores updated successfully`);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating match scores' });
    }
};

const recalculateLeaderboard = async (eventId: string, tx: any) => {
    const matches = await tx.match.findMany({
        where: { eventId, status: 'completed' },
        include: { scores: true }
    });

    const teamStats: Record<string, { points: number; kills: number; wins: number }> = {};

    matches.forEach((match: any) => {
        match.scores.forEach((score: any) => {
            if (!teamStats[score.teamId]) {
                teamStats[score.teamId] = { points: 0, kills: 0, wins: 0 };
            }
            teamStats[score.teamId].points += (score.points || 0);
            teamStats[score.teamId].kills += (score.kills || 0);
            if (score.placement === 1) {
                teamStats[score.teamId].wins += 1;
            }
        });
    });

    const rankedTeams = Object.entries(teamStats).map(([teamId, stats]) => ({
        teamId,
        ...stats
    })).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.kills - a.kills;
    });

    for (let i = 0; i < rankedTeams.length; i++) {
        const team = rankedTeams[i];
        await tx.team.update({
            where: { id: team.teamId },
            data: {
                totalPoints: team.points,
                totalKills: team.kills,
                wins: team.wins,
                rank: i + 1
            }
        });
    }
};

export const deleteMatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.matchScore.deleteMany({ where: { matchId: id as string } });
        await prisma.match.delete({ where: { id: id as string } });
        res.json({ message: 'Match deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting match' });
    }
};
