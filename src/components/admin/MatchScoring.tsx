import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Save, Play, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [scores, setScores] = useState<Record<string, { placement: number; kills: number; points: number }>>({});
  const [saving, setSaving] = useState(false);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);

  // Helper to check if event is BGMI or Free Fire
  const isBattleRoyale = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    const game = event.game?.toLowerCase() || '';
    return game.includes('bgmi') || game.includes('free fire') || game.includes('pubg');
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      if (!editingMatch) fetchTeams(); // Only fetch if not editing to preserve state
      fetchMatches();
    }
  }, [selectedEvent, editingMatch]);

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
      const initialScores: Record<string, { placement: number; kills: number; points: number }> = {};
      data.forEach((team: any) => {
        initialScores[team.id] = { placement: 0, kills: 0, points: 0 };
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
      if (!editingMatch) {
        setMatchNumber((data as any)[0].match_number + 1);
      }
      setMatches(data as any);
    }
  };

  const handleEditMatch = async (matchId: string) => {
    setEditingMatch(matchId);
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    setMatchNumber(match.match_number);

    // Fetch scores for this match
    const { data: scoreData } = await supabase
      .from('match_scores')
      .select('*')
      .eq('match_id', matchId);

    if (scoreData) {
      const newScores: Record<string, { placement: number; kills: number; points: number }> = {};

      // Initialize with default values for all teams first
      teams.forEach((team: any) => {
        newScores[team.id] = { placement: 0, kills: 0, points: 0 };
      });

      // Override with actual scores
      scoreData.forEach((score: any) => {
        newScores[score.team_id] = {
          placement: score.placement,
          kills: score.kills || 0,
          points: score.points || 0
        };
      });

      setScores(newScores);
    }
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
    setScores({});
    fetchTeams(); // Reset to default state
    // Reset match number to next available
    if (matches.length > 0) {
      setMatchNumber((matches[0] as any).match_number + 1);
    } else {
      setMatchNumber(1);
    }
  };

  const handleScoreChange = (teamId: string, field: 'placement' | 'kills' | 'points', value: number) => {
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
      let matchId = editingMatch;

      if (editingMatch) {
        // Update existing match
        const { error: matchError } = await supabase
          .from('matches')
          .update({
            match_number: matchNumber,
          })
          .eq('id', editingMatch);

        if (matchError) throw matchError;

        // Delete existing scores to easier handle updates
        const { error: deleteError } = await supabase
          .from('match_scores')
          .delete()
          .eq('match_id', editingMatch);

        if (deleteError) throw deleteError;
      } else {
        // Create new match
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
        matchId = (matchData as any).id;
      }

      const isBR = isBattleRoyale(selectedEvent);

      const scoreInserts = Object.entries(scores).map(([teamId, score]) => ({
        match_id: matchId,
        team_id: teamId,
        placement: score.placement || 0, // Always required
        kills: isBR ? score.kills : null,
        points: !isBR ? score.points : null, // Manual points for non-BR
      }));

      const { error: scoresError } = await supabase
        .from('match_scores')
        .insert(scoreInserts as any);

      if (scoresError) throw scoresError;

      toast.success(editingMatch ? 'Match updated successfully!' : 'Match scores saved successfully!');

      if (editingMatch) {
        setEditingMatch(null);
      } else {
        setMatchNumber(matchNumber + 1);
      }

      fetchTeams();
      fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      toast.error('Failed to save match scores');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    // if (!confirm("Are you sure you want to delete this match? This action cannot be undone.")) return;
    setMatchToDelete(matchId);
  };

  const confirmDeleteMatch = async () => {
    if (!matchToDelete) return;
    const matchId = matchToDelete;

    try {
      // 1. Delete associated scores first
      const { error: scoresError } = await supabase
        .from('match_scores')
        .delete()
        .eq('match_id', matchId);

      if (scoresError) throw scoresError;

      // 2. Delete the match
      const { error: matchError } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (matchError) throw matchError;

      toast.success('Match deleted successfully');

      // If we were editing this match, cancel edit
      if (editingMatch === matchId) {
        handleCancelEdit();
      } else {
        fetchMatches();
      }
    } catch (error: any) {
      console.error('Error deleting match:', error);
      toast.error('Failed to delete match: ' + error.message);
    } finally {
      setMatchToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Match Scoring</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {editingMatch ? `Editing Match #${matchNumber}` : `Match #${matchNumber}`}
          </span>
          {editingMatch && (
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-card border-2 border-border hover:border-red-500 text-foreground text-sm"
            >
              Cancel
            </button>
          )}
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
                {isBattleRoyale(selectedEvent) ? (
                  <>
                    <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Position</th>
                    <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Kills</th>
                  </>
                ) : (
                  <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Points</th>
                )}
                <th className="px-4 py-3 text-center text-primary uppercase tracking-wider text-sm">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-bold">{team.name}</td>
                  {isBattleRoyale(selectedEvent) ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={scores[team.id]?.placement || 0}
                          onChange={(e) =>
                            handleScoreChange(team.id, 'placement', parseInt(e.target.value) || 0)
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
                    </>
                  ) : (
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={scores[team.id]?.points || 0}
                        onChange={(e) =>
                          handleScoreChange(team.id, 'points', parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-3 py-2 bg-background border-2 border-border focus:border-primary outline-none text-center text-foreground"
                      />
                    </td>
                  )}
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
                  <button
                    onClick={() => handleEditMatch(match.id)}
                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{match.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      <AlertDialog open={!!matchToDelete} onOpenChange={(open) => !open && setMatchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the match and all associated scores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMatch} className="bg-red-600 hover:bg-red-700">
              Delete Match
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchScoring;
