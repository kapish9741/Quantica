
import { Trophy, Clock } from "lucide-react";
import { useLeaderboard, useLiveMatches } from "../hooks/useLeaderboard"; // reusing hooks for team data
import LoaderLeader from "./loaderleader";

interface TournamentBracketProps {
    eventSlug: string;
    isEditable?: boolean;
    onMatchUpdate?: (matchId: string, updates: any) => Promise<void>;
}

// Helper to determine matches for a 8-team single elimination (Standard Quarter Finals -> Semi -> Final)
// We can expand this logic or make it dynamic based on team count later.
// For now, hardcoding an 8-team structure (7 matches total).
// Match IDs/Numbers:
// Round 1 (Quarters): 1, 2, 3, 4
// Round 2 (Semis): 5, 6
// Round 3 (Final): 7

const TournamentBracket = ({ eventSlug, isEditable = false, onMatchUpdate }: TournamentBracketProps) => {
    const { teams, event: eventData, loading: teamsLoading } = useLeaderboard(eventSlug);
    const { matches, loading: matchesLoading } = useLiveMatches(eventSlug);

    if (teamsLoading || matchesLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoaderLeader />
            </div>
        );
    }

    const getMatchData = (matchNum: number) => {
        return matches.find(m => m.matchNumber === matchNum);
    };

    const MatchNode = ({ matchNum }: { matchNum: number, nextMatchNum?: number }) => {
        const match = getMatchData(matchNum);

        return (
            <div className={`relative flex flex-col items-center gap-2 w-64 md:w-72 shrink-0 group ${match?.status === 'live' ? 'z-10' : ''}`}>
                <div className={`w-full bg-card border rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${match?.status === 'live'
                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105'
                    : 'border-border/50 hover:border-primary/50'
                    }`}>
                    <div className="p-2 border-b border-border/50 flex justify-between items-center bg-black/40">
                        <span className="text-xs text-muted-foreground">Match {matchNum}</span>
                        {isEditable ? (
                            <select
                                className="bg-transparent text-xs border border-border/50 rounded p-0.5 outline-none"
                                value={match?.status || 'scheduled'}
                                onChange={(e) => match && onMatchUpdate?.(match.id, { status: e.target.value })}
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </select>
                        ) : (
                            <>
                                {match?.status === 'live' && <span className="text-xs text-red-500 animate-pulse flex items-center gap-1 font-bold tracking-wider"><span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_red]" /> LIVE</span>}
                                {match?.status === 'completed' && <span className="text-xs text-green-500 font-bold">Finished</span>}
                                {match?.status === 'scheduled' && <span className="text-xs text-muted-foreground">Upcoming</span>}
                            </>
                        )}
                    </div>

                    {/* Team 1 */}
                    <div className={`p-3 flex justify-between items-center ${match?.winnerTeamId && match.team1Id === match.winnerTeamId ? 'bg-primary/10' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden border border-border">
                                {teams.find(t => t.id === match?.team1Id)?.name.charAt(0) || '?'}
                            </div>
                            <span className={`text-sm font-bold ${match?.winnerTeamId && match.team1Id === match.winnerTeamId ? 'text-primary' : 'text-foreground'}`}>
                                {teams.find(t => t.id === match?.team1Id)?.name || 'TBD'}
                            </span>
                        </div>
                        {isEditable ? (
                            <input
                                type="text"
                                className="w-10 bg-background border border-border rounded text-center text-sm p-1"
                                defaultValue={match?.team1Score || ''}
                                onBlur={(e) => match && onMatchUpdate?.(match.id, { team1Score: e.target.value })}
                            />
                        ) : (
                            <span className="text-lg font-mono">
                                {match?.team1Score || '-'}
                            </span>
                        )}
                        {isEditable && match?.team1Id && (
                            <button
                                onClick={() => match && onMatchUpdate?.(match.id, { winnerTeamId: match.team1Id })}
                                className={`ml-2 p-1 rounded hover:bg-muted ${match?.winnerTeamId === match?.team1Id ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                title="Set Winner"
                            >
                                <Trophy size={14} />
                            </button>
                        )}
                    </div>

                    <div className="h-[1px] bg-border/50 w-full" />

                    {/* Team 2 */}
                    <div className={`p-3 flex justify-between items-center ${match?.winnerTeamId && match.team2Id === match.winnerTeamId ? 'bg-primary/10' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden border border-border">
                                {teams.find(t => t.id === match?.team2Id)?.name.charAt(0) || '?'}
                            </div>
                            <span className={`text-sm font-bold ${match?.winnerTeamId && match.team2Id === match.winnerTeamId ? 'text-primary' : 'text-foreground'}`}>
                                {teams.find(t => t.id === match?.team2Id)?.name || 'TBD'}
                            </span>
                        </div>
                        {isEditable ? (
                            <input
                                type="text"
                                className="w-10 bg-background border border-border rounded text-center text-sm p-1"
                                defaultValue={match?.team2Score || ''}
                                onBlur={(e) => match && onMatchUpdate?.(match.id, { team2Score: e.target.value })}
                            />
                        ) : (
                            <span className="text-lg font-mono">
                                {match?.team2Score || '-'}
                            </span>
                        )}
                        {isEditable && match?.team2Id && (
                            <button
                                onClick={() => match && onMatchUpdate?.(match.id, { winnerTeamId: match.team2Id })}
                                className={`ml-2 p-1 rounded hover:bg-muted ${match?.winnerTeamId === match?.team2Id ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                title="Set Winner"
                            >
                                <Trophy size={14} />
                            </button>
                        )}
                    </div>

                    {/* Date/Time footer */}
                    <div className={`px-3 py-2 bg-black/20 flex items-center justify-between gap-2 text-[10px] text-muted-foreground border-t border-border/50 ${match?.status === 'live' ? 'bg-red-500/5' : ''}`}>
                        <div className="flex items-center gap-2">
                            <Clock className={`w-3 h-3 ${match?.status === 'live' ? 'text-red-400' : ''}`} />
                            {isEditable ? (
                                <input
                                    type="datetime-local"
                                    className="bg-background border border-border rounded px-1 text-[10px] w-32"
                                    value={match?.scheduledDate ? new Date(match.scheduledDate).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => match && onMatchUpdate?.(match.id, { scheduledDate: e.target.value })}
                                />
                            ) : (
                                <span className={match?.status === 'live' ? 'text-red-400 font-bold' : ''}>
                                    {match?.scheduledDate
                                        ? new Date(match.scheduledDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                                        : 'Date TBD'
                                    }
                                </span>
                            )}
                        </div>
                        {match?.status === 'live' && !isEditable && (
                            <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live Now
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {eventData?.status === 'ongoing' && !isEditable && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2 text-center text-xs font-bold uppercase tracking-widest animate-pulse mx-4 mt-4 rounded">
                    ● Event is Live
                </div>
            )}
            <div className="w-full overflow-x-auto p-4 custom-scrollbar">
                <div className="min-w-[1000px] flex justify-between items-center gap-8 py-8">

                    {/* Round 1 - Quarter Finals */}
                    <div className="flex flex-col gap-8 justify-around h-full">
                        <h3 className="text-center font-bold text-muted-foreground uppercase tracking-widest text-sm mb-4">Quarter Finals</h3>
                        <div className="flex flex-col gap-12">
                            <MatchNode matchNum={1} />
                            <MatchNode matchNum={2} />
                            <MatchNode matchNum={3} />
                            <MatchNode matchNum={4} />
                        </div>
                    </div>

                    {/* Connectors 1 */}
                    <div className="flex flex-col gap-12 h-full py-16">
                        {/* Connector group 1 */}
                        <div className="flex flex-col justify-center h-[200px]">
                            <div className="border-r border-t border-b border-muted-foreground/30 w-8 h-1/2 rounded-r-lg" />
                        </div>
                        {/* Connector group 2 */}
                        <div className="flex flex-col justify-center h-[200px]">
                            <div className="border-r border-t border-b border-muted-foreground/30 w-8 h-1/2 rounded-r-lg" />
                        </div>
                    </div>

                    {/* Round 2 - Semi Finals */}
                    <div className="flex flex-col gap-8 justify-around h-full">
                        <h3 className="text-center font-bold text-muted-foreground uppercase tracking-widest text-sm mb-4">Semi Finals</h3>
                        <div className="flex flex-col gap-32">
                            <MatchNode matchNum={5} />
                            <MatchNode matchNum={6} />
                        </div>
                    </div>

                    {/* Connectors 2 */}
                    <div className="flex flex-col justify-center h-full">
                        <div className="border-r border-t border-b border-muted-foreground/30 w-8 h-[300px] rounded-r-lg" />
                    </div>

                    {/* Round 3 - Final */}
                    <div className="flex flex-col gap-8 justify-center h-full">
                        <h3 className="text-center font-bold text-primary uppercase tracking-widest text-sm mb-4">Grand Final</h3>
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <MatchNode matchNum={7} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentBracket;
