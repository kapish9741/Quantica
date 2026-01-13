import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Users } from "lucide-react";
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
import LoaderLeader from "../loaderleader";

type Team = Database['public']['Tables']['teams']['Row'];
type TeamUpdate = Database['public']['Tables']['teams']['Update'];
type Participant = Database['public']['Tables']['participants']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

const TeamManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTeams();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date');
    if (data) setEvents(data);
  };

  const fetchTeams = async () => {
    setLoading(true);
    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .eq('event_id', selectedEvent)
      .order('rank');

    if (teamsData) {
      setTeams(teamsData as any);

      const participantsMap: Record<string, Participant[]> = {};
      for (const team of teamsData) {
        const { data: partData } = await supabase
          .from('participants')
          .select('*')
          .eq('team_id', (team as any).id);
        if (partData) participantsMap[(team as any).id] = partData as any;
      }
      setParticipants(participantsMap);
    }
    setLoading(false);
  };

  const handleAddTeam = async () => {
    if (!newTeamName || !selectedEvent) return;

    // @ts-ignore - Supabase type inference issue with insert
    const { error } = await supabase.from('teams').insert({
      name: newTeamName,
      event_id: selectedEvent,
    });

    if (!error) {
      setNewTeamName("");
      setShowAddTeam(false);
      fetchTeams();
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeamToDelete(teamId);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;
    const teamId = teamToDelete;

    try {
      // 1. Delete match scores
      const { error: matchScoresError } = await supabase
        .from('match_scores')
        .delete()
        .eq('team_id', teamId);

      if (matchScoresError) {
        console.error('Error deleting match scores:', matchScoresError);
        toast.error(`Failed to delete associated match scores: ${matchScoresError.message}`);
        throw new Error(`Failed to delete associated match scores: ${matchScoresError.message}`);
      }

      // 2. Clear references in matches (team1_id, team2_id, winner_team_id)
      const { error: matchRefError1 } = await supabase
        .from('matches')
        .update({ team1_id: null } as any)
        .eq('team1_id', teamId);

      if (matchRefError1) console.warn("Failed to clear team1 refs", matchRefError1);

      const { error: matchRefError2 } = await supabase
        .from('matches')
        .update({ team2_id: null } as any)
        .eq('team2_id', teamId);

      if (matchRefError2) console.warn("Failed to clear team2 refs", matchRefError2);

      const { error: matchRefError3 } = await supabase
        .from('matches')
        .update({ winner_team_id: null } as any)
        .eq('winner_team_id', teamId);

      if (matchRefError3) console.warn("Failed to clear winner refs", matchRefError3);

      // 3. Delete participants
      const { error: participantsError } = await supabase
        .from('participants')
        .delete()
        .eq('team_id', teamId);

      if (participantsError) {
        console.error('Error deleting participants:', participantsError);
        toast.error(`Failed to delete associated participants: ${participantsError.message}`);
        throw new Error(`Failed to delete associated participants: ${participantsError.message}`);
      }

      // 4. Finally delete the team
      const { data, error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)
        .select();

      if (teamError) throw teamError;

      if (!data || data.length === 0) {
        // Fallback check
        const { data: check } = await supabase.from('teams').select('id').eq('id', teamId);
        if (check && check.length > 0) {
          const msg = "Team exists but could not be deleted. This usually means a permission issue.";
          toast.error(msg);
          throw new Error(msg);
        }
      }

      console.log("Team deleted successfully");
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (error: any) {
      console.error('Error deleting team:', error);
      toast.error(error.message || 'An error occurred while deleting the team');
    } finally {
      setTeamToDelete(null);
    }
  };

  const handleUpdateTeam = async (teamId: string, newName: string) => {
    const { error } = await supabase
      .from('teams')
      // @ts-ignore - Supabase type inference issue with Update types
      .update({ name: newName })
      .eq('id', teamId);

    if (!error) {
      setEditingTeam(null);
      fetchTeams();
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
        <button
          onClick={() => setShowAddTeam(!showAddTeam)}
          className="glitch-btn bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Team
        </button>
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

      {showAddTeam && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-2 border-primary p-4"
        >
          <h3 className="font-bold text-primary mb-4">Add New Team</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              className="flex-1 px-4 py-2 bg-background border-2 border-border focus:border-primary outline-none text-foreground"
            />
            <button
              onClick={handleAddTeam}
              className="glitch-btn bg-primary text-primary-foreground px-6 py-2 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setShowAddTeam(false)}
              className="px-6 py-2 bg-card border-2 border-border hover:border-red-500 text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <LoaderLeader />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No teams found. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border-2 border-border p-4 clip-corner"
            >
              <div className="flex items-start justify-between mb-3">
                {editingTeam === team.id ? (
                  <input
                    type="text"
                    defaultValue={team.name}
                    onBlur={(e) => handleUpdateTeam(team.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateTeam(team.id, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 px-2 py-1 bg-background border-2 border-primary outline-none text-foreground font-bold"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-bold text-lg text-foreground">{team.name}</h3>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTeam(editingTeam === team.id ? null : team.id)}
                    className="p-2 hover:bg-primary/20 text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <div>
                  <div className="text-2xl font-bold text-secondary">{team.total_points}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{team.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{team.total_kills}</div>
                  <div className="text-xs text-muted-foreground">Kills</div>
                </div>
              </div>

              {participants[team.id] && participants[team.id].length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <strong>Players:</strong> {participants[team.id].map(p => p.name).join(", ")}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}


      <AlertDialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team, remove all their match scores, and clear them from match history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTeam} className="bg-red-600 hover:bg-red-700">
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManagement;
