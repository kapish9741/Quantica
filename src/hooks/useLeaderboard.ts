import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];
type MatchScore = Database['public']['Tables']['match_scores']['Row'];

export interface LeaderboardTeam extends Team {
  participants?: { name: string }[];
}

export interface LiveMatch extends Match {
  scores?: MatchScore[];
}

export function useLeaderboard(eventSlug: string) {
  const [teams, setTeams] = useState<LeaderboardTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id')
          .eq('slug', eventSlug)
          .single();

        if (eventError) throw eventError;
        if (!eventData) {
          setTeams([]);
          setLoading(false);
          return;
        }

        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select(`
            *,
            participants (name)
          `)
          .eq('event_id', (eventData as any).id)
          .order('rank', { ascending: true });

        if (teamsError) throw teamsError;

        setTeams((teamsData as any) || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();

    const channel = supabase
      .channel(`leaderboard-${eventSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_scores',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventSlug]);

  return { teams, loading, error };
}

export function useLiveMatches(eventSlug: string) {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data: eventData } = await supabase
          .from('events')
          .select('id')
          .eq('slug', eventSlug)
          .single();

        if (!eventData) {
          setMatches([]);
          setLoading(false);
          return;
        }

        const { data: matchesData } = await supabase
          .from('matches')
          .select(`
            *,
            match_scores (*)
          `)
          .eq('event_id', (eventData as any).id)
          .order('match_number', { ascending: false })
          .limit(10);

        setMatches((matchesData as any) || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();

    const channel = supabase
      .channel(`matches-${eventSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventSlug]);

  return { matches, loading };
}

export function useRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState<Database['public']['Tables']['roadmap_items']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const { data } = await supabase
          .from('roadmap_items')
          .select('*')
          .order('date', { ascending: true });

        setRoadmapItems(data || []);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('roadmap-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roadmap_items',
        },
        () => {
          fetchRoadmap();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { roadmapItems, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<Database['public']['Tables']['events']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading };
}
