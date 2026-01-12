import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Save, Play, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Database } from "../../types/database.types";

type Event = Database['public']['Tables']['events']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

const MatchScoring = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchNumber, setMatchNumber] = useState(1);
  const [scores, setScores] = useState<Record<string, { placement: number; kills: number }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTeams();
      fetchMatches();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date');
    if (data) setEvents(data as any);
  };

  const fetchTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('event_id', selectedEvent)
      .order('name');
    if (data) {
      setTeams(data as any);
      const initialScores: Record<string, { placement: number; kills: number }> = {};
      data.forEach((team: any, index: number) => {
        initialScores[team.id] = { placement: index + 1, kills: 0 };
      });
      setScores(initialScores);
    }
  };

  const fetchMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .eq('event_id', selectedEvent)
      .order('match_number', { ascending: false });
    
    if (data && data.length > 0) {
      setMatchNumber((data as any)[0].match_number + 1);
      setMatches(data as any);
    }
  };

  const handleScoreChange = (teamId: string, field: 'placement' | 'kills', value: number) => {
    setScores(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: value
      }
    }));
  };

  const handleSaveMatch = async () => {
    if (!selectedEvent || teams.length === 0) return;

    setSaving(true);

    try {
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({
          event_id: selectedEvent,
          match_number: matchNumber,
          status: 'completed',
          scheduled_date: new Date().toISOString(),
        } as any)
        .select()
        .single();

      if (matchError) throw matchError;
      if (!matchData) throw new Error('No match data returned');

      const scoreInserts = Object.entries(scores).map(([teamId, score]) => ({
        match_id: (matchData as any).id,
        team_id: teamId,
        placement: score.placement,
        kills: score.kills,
      }));

      const { error: scoresError } = await supabase
        .from('match_scores')
        .insert(scoreInserts as any);

      if (scoresError) throw scoresError;

      setMatchNumber(matchNumber + 1);
      fetchTeams();
      fetchMatches();
      
      alert('Match scores saved successfully!');
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Failed to save match scores');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Match Scoring</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Match #{matchNumber}</span>
          <button
            onClick={handleSaveMatch}
            disabled={saving || !selectedEvent}
            className="glitch-btn bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Match
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">
          Select Event
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-4 py-3 bg-background border-2 border-border focus:border-primary outline-none text-foreground"
        >
          <option value="">Choose an event...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && teams.length > 0 ? (
        <div className="bg-card border-2 border-border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-primary uppercase tracking-wider text-sm">Team</th>
                <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Position</th>
                <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Kills</th>
                <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Current Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-bold">{team.name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={scores[team.id]?.placement || index + 1}
                      onChange={(e) =>
                        handleScoreChange(team.id, 'placement', parseInt(e.target.value) || 1)
                      }
                      className="w-20 px-3 py-2 bg-background border-2 border-border focus:border-primary outline-none text-center text-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={scores[team.id]?.kills || 0}
                      onChange={(e) =>
                        handleScoreChange(team.id, 'kills', parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-3 py-2 bg-background border-2 border-border focus:border-primary outline-none text-center text-foreground"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-secondary">
                    {team.total_points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <div className="flex items-center justify-center">
            <Play className="w-12 h-12 text-primary" />
          </div>
          <p>Select an event to start scoring</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-foreground">Recent Matches</h3>
          <div className="space-y-2">
            {matches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between bg-card border border-border p-3"
              >
                <span className="font-bold">Match #{match.match_number}</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{match.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScoring;
