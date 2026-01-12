import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Users } from "lucide-react";
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

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    const { error } = await supabase.from('teams').delete().eq('id', teamId);
    if (!error) fetchTeams();
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
    </div>
  );
};

export default TeamManagement;
