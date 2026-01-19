
import { useState, useEffect } from "react";
import { Save, Trophy } from "lucide-react";
import api from "../../lib/api";
import TournamentBracket from "../TournamentBracket";
import { Event, Team, Match } from "../../hooks/useLeaderboard"; // Reuse types

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
        try {
            const { data } = await api.get<Event[]>('/events');
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeams = async () => {
        try {
            const { data } = await api.get<Team[]>(`/teams?eventId=${selectedEvent}`);
            setTeams(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMatches = async () => {
        try {
            const { data } = await api.get<Match[]>(`/matches?eventId=${selectedEvent}`);
            setMatches(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateMatch = async (matchId: string, updates: Partial<Match>) => {
        setLoading(true);
        try {
            await api.put(`/matches/${matchId}`, updates);
            fetchMatches();
        } catch (error) {
            console.error(error);
            alert("Failed to update match");
        } finally {
            setLoading(false);
        }
    };

    // Callback used by TournamentBracket visual editor
    const handleBracektUpdate = async (matchId: string, updates: any) => {
        await handleUpdateMatch(matchId, updates);
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
                            try {
                                await api.put(`/events/${selectedEvent}`, { status: newStatus });
                                fetchEvents();
                            } catch (error) {
                                console.error(error);
                                alert("Failed to update event status");
                            }
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
