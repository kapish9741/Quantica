import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Event, Team, Match } from './useLeaderboard';

interface UseTeamStatsOptions {
  eventId: string;
}

interface TeamStatsResult {
  teams: Team[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch teams and calculate their statistics from match scores
 * This ensures Team Management always shows up-to-date statistics
 */
export function useTeamStats({ eventId }: UseTeamStatsOptions): TeamStatsResult {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!eventId) {
      setTeams([]);
      setLoading(false);
      return;
    }

    async function fetchTeamStats() {
      try {
        setLoading(true);

        // 1. Fetch Teams for Event
        const teamsRes = await api.get<Team[]>(`/teams?eventId=${eventId}`);
        const rawTeams = teamsRes.data;

        // 2. Fetch Matches with Scores for Event
        const matchesRes = await api.get<Match[]>(`/matches?eventId=${eventId}`);
        const matches = matchesRes.data;

        // 3. Calculate team statistics from match scores
        const teamStats = new Map<string, { totalPoints: number; totalKills: number; wins: number }>();

        // Initialize stats for all teams
        rawTeams.forEach(team => {
          teamStats.set(team.id, { totalPoints: 0, totalKills: 0, wins: 0 });
        });

        // Aggregate stats from all match scores
        matches.forEach(match => {
          if (match.scores && match.scores.length > 0) {
            // Find the winning team (placement === 1 for Battle Royale)
            const winningScore = match.scores.find(score => score.placement === 1);

            match.scores.forEach(score => {
              const stats = teamStats.get(score.teamId);
              if (stats) {
                stats.totalPoints += score.points || 0;
                stats.totalKills += score.kills || 0;
                if (winningScore && score.teamId === winningScore.teamId) {
                  stats.wins += 1;
                }
              }
            });
          }
        });

        // 4. Merge calculated stats with team data
        const enrichedTeams = rawTeams.map(team => {
          const stats = teamStats.get(team.id) || { totalPoints: 0, totalKills: 0, wins: 0 };
          return {
            ...team,
            totalPoints: stats.totalPoints,
            totalKills: stats.totalKills,
            wins: stats.wins,
          };
        });

        // 5. Sort by totalPoints descending and assign ranks
        const sortedTeams = enrichedTeams.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
        const rankedTeams = sortedTeams.map((team, index) => ({
          ...team,
          rank: index + 1,
        }));

        setTeams(rankedTeams);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching team stats:', err);
        setError(err.message || 'Failed to fetch team statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamStats();
  }, [eventId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { teams, loading, error, refetch };
}
