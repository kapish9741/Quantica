
import { useEffect, useState } from 'react';
import api from '../lib/api';

// Define explicit types matching the backend response
export interface Team {
  id: string;
  name: string;
  eventId: string;
  totalPoints: number | null;
  totalKills: number | null;
  wins: number | null;
  rank: number | null;
  participants: { name: string }[];
}

export interface MatchScore {
  teamId: string;
  placement: number;
  kills: number;
  points: number;
  team?: Team;
}

export interface Match {
  id: string;
  matchNumber: number;
  team1Id: string | null;
  team2Id: string | null;
  winnerTeamId: string | null;
  team1Score: string | null;
  team2Score: string | null;
  status: 'scheduled' | 'live' | 'completed';
  scheduledDate: string;
  scores: MatchScore[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Event {
  id: string;
  name: string;
  game: string;
  date: string;
  status: string;
  slug: string;
}

export function useLeaderboard(eventSlug: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        // 1. Get Event ID from Slug
        const eventsRes = await api.get<Event[]>('/events');
        const foundEvent = eventsRes.data.find(e => e.slug === eventSlug);

        if (!foundEvent) {
          setTeams([]);
          setEvent(null);
          setLoading(false);
          return;
        }
        setEvent(foundEvent);

        // 2. Fetch Teams for Event
        const teamsRes = await api.get<Team[]>(`/teams?eventId=${foundEvent.id}`);
        setTeams(teamsRes.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    }

    if (eventSlug) {
      fetchLeaderboard();
      // Simple polling
      const interval = setInterval(fetchLeaderboard, 30000);
      return () => clearInterval(interval);
    }
  }, [eventSlug]);

  return { teams, event, loading, error };
}

export function useLiveMatches(eventSlug: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const eventsRes = await api.get<Event[]>('/events');
        const event = eventsRes.data.find(e => e.slug === eventSlug);

        if (!event) {
          setMatches([]);
          setLoading(false);
          return;
        }

        const matchesRes = await api.get<Match[]>(`/matches?eventId=${event.id}`);
        setMatches(matchesRes.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    }

    if (eventSlug) {
      fetchMatches();
      const interval = setInterval(fetchMatches, 30000);
      return () => clearInterval(interval);
    }
  }, [eventSlug]);

  return { matches, loading };
}

export function useRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await api.get<RoadmapItem[]>('/roadmap');
        setRoadmapItems(res.data);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, []);

  return { roadmapItems, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get<Event[]>('/events');
        setEvents(res.data);
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
