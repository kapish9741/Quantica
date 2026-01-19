import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Match = Database['public']['Tables']['matches']['Row'];
type MatchScore = Database['public']['Tables']['match_scores']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];

export interface TournamentMatch extends Match {
  teams: {
    team: Team | null;
    score: number | null;
    placement: number;
  }[];
}

export interface TournamentRound {
  name: string;
  index: number;
  matches: TournamentMatch[];
}

export const useTournament = (eventId: string) => {
  const [rounds, setRounds] = useState<TournamentRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    fetchTournamentData();

    // Subscribe to changes
    const matchesSubscription = supabase
      .channel(`tournament-matches-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `event_id=eq.${eventId}` },
        () => fetchTournamentData()
      )
      .subscribe();

    const scoresSubscription = supabase
      .channel(`tournament-scores-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'match_scores' },
        () => fetchTournamentData()
      )
      .subscribe();

    return () => {
      matchesSubscription.unsubscribe();
      scoresSubscription.unsubscribe();
    };
  }, [eventId]);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      
      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('event_id', eventId)
        .order('round_index', { ascending: true })
        .order('match_number', { ascending: true });

      if (matchesError) throw matchesError;

      // Fetch scores and teams
      const { data: scoresData, error: scoresError } = await supabase
        .from('match_scores')
        .select(`
          *,
          teams (*)
        `)
        .in('match_id', matchesData.map(m => m.id));

      if (scoresError) throw scoresError;

      // Process data into rounds
      const processedMatches = matchesData.map(match => {
        const matchScores = scoresData.filter(s => s.match_id === match.id);
        const teams = matchScores.map(s => ({
          team: s.teams as unknown as Team, // Type assertion due to join
          score: s.kills || 0, // Assuming kills or points is the score for now
          placement: s.placement
        })).sort((a, b) => a.placement - b.placement); // Usually 1 vs 2

        return {
          ...match,
          teams
        };
      });

      // Group by round
      const roundsMap = new Map<number, TournamentRound>();
      processedMatches.forEach(match => {
        const roundIndex = match.round_index || 0;
        if (!roundsMap.has(roundIndex)) {
          roundsMap.set(roundIndex, {
            name: match.round_name || `Round ${roundIndex + 1}`,
            index: roundIndex,
            matches: []
          });
        }
        roundsMap.get(roundIndex)?.matches.push(match);
      });

      const sortedRounds = Array.from(roundsMap.values()).sort((a, b) => a.index - b.index);
      setRounds(sortedRounds);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tournament data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { rounds, loading, error, refresh: fetchTournamentData };
};
