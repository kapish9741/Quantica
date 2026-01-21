
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
import api from "../../lib/api";
import { Event, Team, Match } from "../../hooks/useLeaderboard"; // Reuse types

interface MatchScoringProps {
  preSelectedEventId?: string;
}

const MatchScoring = ({ preSelectedEventId }: MatchScoringProps = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>(preSelectedEventId || "");
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
    if (preSelectedEventId) {
      setSelectedEvent(preSelectedEventId);
    }
  }, [preSelectedEventId]);

  useEffect(() => {
    if (selectedEvent) {
      if (!editingMatch) fetchTeams(); // Only fetch if not editing to preserve state
      fetchMatches();
    }
  }, [selectedEvent, editingMatch]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get<Event[]>('/events');
      const includedSlugs = ['bgmi', 'freefire'];
      setEvents(data.filter(event => includedSlugs.includes(event.slug)));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data } = await api.get<Team[]>(`/teams?eventId=${selectedEvent}`);
      setTeams(data);
      const initialScores: Record<string, { placement: number; kills: number; points: number }> = {};
      data.forEach((team) => {
        initialScores[team.id] = { placement: 0, kills: 0, points: 0 };
      });
      setScores(initialScores);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data } = await api.get<Match[]>(`/matches?eventId=${selectedEvent}`);
      // Sort manually if backend sort isn't enough or different
      const sorted = data.sort((a, b) => b.matchNumber - a.matchNumber);

      if (data && data.length > 0) {
        if (!editingMatch) {
          setMatchNumber(sorted[0].matchNumber + 1);
        }
        setMatches(sorted);
      } else {
        setMatches([]);
        setMatchNumber(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditMatch = async (matchId: string) => {
    setEditingMatch(matchId);
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    setMatchNumber(match.matchNumber);

    // Populate scores from match.scores (included in fetching)
    const newScores: Record<string, { placement: number; kills: number; points: number }> = {};

    // Initialize default
    teams.forEach((team) => {
      newScores[team.id] = { placement: 0, kills: 0, points: 0 };
    });

    // Override with actual scores
    if (match.scores) {
      match.scores.forEach((score) => {
        newScores[score.teamId] = {
          placement: score.placement,
          kills: score.kills || 0,
          points: score.points || 0
        };
      });
    }

    setScores(newScores);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
    setScores({});
    fetchTeams(); // Reset to default state
    // Reset match number to next available
    if (matches.length > 0) {
      setMatchNumber(matches[0].matchNumber + 1);
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

      // Prepare scores array for backend
      const scoreData = Object.entries(scores).map(([teamId, score]) => ({
        teamId: teamId,
        placement: score.placement || 0,
        kills: score.kills || 0,
        points: score.points || 0, // Backend might recalc points based on scheme, but we send what we have
      }));

      if (editingMatch) {
        // Update match number (if changed) and Status
        await api.put(`/matches/${editingMatch}`, { matchNumber });

        // Update Scores
        await api.put(`/matches/${editingMatch}/score`, { scores: scoreData });
      } else {
        // Create new match
        const { data: newMatch } = await api.post('/matches', {
          eventId: selectedEvent,
          matchNumber: matchNumber,
          status: 'completed',
          scheduledDate: new Date().toISOString(),
        });
        matchId = newMatch.id;

        // Add scores to new match
        await api.put(`/matches/${matchId}/score`, { scores: scoreData });
      }

      toast.success(editingMatch ? 'Match updated successfully!' : 'Match scores saved successfully!');

      if (editingMatch) {
        setEditingMatch(null);
      } else {
        setMatchNumber(matchNumber + 1);
      }

      fetchTeams();
      fetchMatches();
    } catch (error: any) {
      console.error('Error saving match:', error);
      toast.error('Failed to save match scores');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    setMatchToDelete(matchId);
  };

  const confirmDeleteMatch = async () => {
    if (!matchToDelete) return;
    const matchId = matchToDelete;

    try {
      await api.delete(`/matches/${matchId}`);
      toast.success('Match deleted successfully');

      if (editingMatch === matchId) {
        handleCancelEdit();
      } else {
        fetchMatches();
      }
    } catch (error: any) {
      console.error('Error deleting match:', error);
      toast.error('Failed to delete match');
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

      {!preSelectedEventId && (
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
      )}

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
              {teams.map((team) => (
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
                    {team.totalPoints}
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
                <span className="font-bold">Match #{match.matchNumber}</span>
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
