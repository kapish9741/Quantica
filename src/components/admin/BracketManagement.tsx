import { useState, useEffect } from "react";
import { Save, Trophy } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Database } from "../../types/database.types";
import TournamentBracket from "../TournamentBracket";

type Event = Database['public']['Tables']['events']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

interface BracketManagementProps {
    preSelectedEventId?: string;
}

const BracketManagement = ({ preSelectedEventId }: BracketManagementProps = {}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>(preSelectedEventId || "");
    const [teams, setTeams] = useState<Team[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(false);

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
            fetchTeams();
            fetchMatches();
        }
    }, [selectedEvent]);

    const fetchEvents = async () => {
        const { data } = await supabase.from('events').select('*').order('date');
        // Filter for knockout events if possible, or just show all
        if (data) setEvents(data);
    };

    const fetchTeams = async () => {
        const { data } = await supabase.from('teams').select('*').eq('event_id', selectedEvent).order('name');
        if (data) setTeams(data);
    };

    const fetchMatches = async () => {
        const { data } = await supabase.from('matches').select('*').eq('event_id', selectedEvent).order('match_number');
        if (data) setMatches(data);
    };

    const handleUpdateMatch = async (matchId: string, updates: Partial<Match>) => {
        setLoading(true);
        const { error } = await supabase
            .from('matches')
            // @ts-ignore
            // @ts-ignore
            .update(updates)
            .eq('id', matchId);

        if (!error) {
            fetchMatches();
        } else {
            console.error(error);
            alert("Failed to update match");
        }
        setLoading(false);
    };

    const getMatch = (matchNum: number) => matches.find(m => m.match_number === matchNum);

    const CreateMatchCard = ({ matchNum, title }: { matchNum: number, title: string }) => {
        const match = getMatch(matchNum);

        // Local state for score inputs not needed if we just prompt or use simple inputs 
        // that update on blur/enter. For simplicity, let's use prompt or direct values.

        // If match doesn't exist, we need to create it first? 
        // Or assume pre-seeded matches. For this admin panel, let's assume we are UPDATING existing matches
        // or inserting on first edit if missing.

        // Helper to find team name
        const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || "TBD";

        const assignTeam = async (slot: 'team1_id' | 'team2_id', teamId: string) => {
            if (!match) {
                // @ts-ignore
                await supabase.from('matches').insert({
                    event_id: selectedEvent,
                    match_number: matchNum,
                    status: 'scheduled',
                    [slot]: teamId
                });
                fetchMatches();
            } else {
                handleUpdateMatch(match.id, { [slot]: teamId });
            }
        };


        return (
            <div className="bg-card border border-border p-4 rounded-lg w-full max-w-sm mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-muted-foreground text-xs uppercase">{title} (Match {matchNum})</span>
                    <select
                        className="bg-background border border-border text-xs p-1 rounded"
                        value={match?.status || 'scheduled'}
                        onChange={(e) => match && handleUpdateMatch(match.id, { status: e.target.value as any })}
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Team 1 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <select
                        className="bg-background border border-border text-sm p-2 rounded flex-1 w-full max-w-[140px]"
                        value={match?.team1_id || ""}
                        onChange={(e) => assignTeam('team1_id', e.target.value)}
                    >
                        <option value="">Select Team 1</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input
                        type="text"
                        placeholder="Score"
                        className="w-12 bg-background border border-border p-2 rounded text-center"
                        defaultValue={match?.team1_score || ""}
                        onBlur={(e) => match && handleUpdateMatch(match.id, { team1_score: e.target.value })}
                    />
                    <button
                        onClick={() => match && match.team1_id && handleUpdateMatch(match.id, { winner_team_id: match.team1_id })}
                        className={`p-1 rounded ${match?.winner_team_id === match?.team1_id ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'}`}
                    >
                        <Trophy size={14} />
                    </button>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between gap-2">
                    <select
                        className="bg-background border border-border text-sm p-2 rounded flex-1 w-full max-w-[140px]"
                        value={match?.team2_id || ""}
                        onChange={(e) => assignTeam('team2_id', e.target.value)}
                    >
                        <option value="">Select Team 2</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input
                        type="text"
                        placeholder="Score"
                        className="w-12 bg-background border border-border p-2 rounded text-center"
                        defaultValue={match?.team2_score || ""}
                        onBlur={(e) => match && handleUpdateMatch(match.id, { team2_score: e.target.value })}
                    />
                    <button
                        onClick={() => match && match.team2_id && handleUpdateMatch(match.id, { winner_team_id: match.team2_id })}
                        className={`p-1 rounded ${match?.winner_team_id === match?.team2_id ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'}`}
                    >
                        <Trophy size={14} />
                    </button>
                </div>
            </div>
        );
    };

    const handleBracektUpdate = async (matchId: string, updates: any) => {
        setLoading(true);
        const { error } = await supabase
            .from('matches')
            // @ts-ignore
            .update(updates)
            .eq('id', matchId);

        if (error) {
            console.error(error);
            alert("Failed to update match");
        }
        setLoading(false);
    };

    const selectedEventSlug = events.find(e => e.id === selectedEvent)?.slug;

    return (
        <div className="space-y-6">
            {!preSelectedEventId && (
                <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">
                        Select Knockout Event
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

            {selectedEvent && (
                <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Event Status</h3>
                        <p className="text-xs text-muted-foreground">Set to "Ongoing" to show LIVE badge on leaderboard.</p>
                    </div>
                    <select
                        value={events.find(e => e.id === selectedEvent)?.status || 'upcoming'}
                        onChange={async (e) => {
                            const newStatus = e.target.value;
                            // Optimistic update local state (optional, or just wait for re-fetch)
                            // For now just Trigger DB update
                            // @ts-ignore
                            await supabase.from('events').update({ status: newStatus as any }).eq('id', selectedEvent);
                            fetchEvents(); // Refresh list to update UI
                        }}
                        className="bg-background border border-border px-3 py-2 rounded"
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing (Live)</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            )}

            {selectedEvent && selectedEventSlug && (
                <div className="border border-border rounded-lg p-4 bg-black/20">
                    <p className="text-sm text-muted-foreground mb-4">
                        💡 Click on scores to edit. Use the drop-down to change match status. Click the trophy icon to set a winner.
                    </p>
                    <TournamentBracket
                        eventSlug={selectedEventSlug}
                        isEditable={true}
                        onMatchUpdate={handleBracektUpdate}
                    />
                </div>
            )}
        </div>
    );
};

export default BracketManagement;
