import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trophy, Map, X } from "lucide-react";
import PageTransition from "../components/PageTransition";
import GlitchText from "../components/GlitchText";
import EventLeaderboard from "../components/EventLeaderboard";
import TournamentBracket from "../components/TournamentBracket";
import { events } from "../data/events";


const Leaderboard = () => {
  const [activeEvent, setActiveEvent] = useState<string>(events[0]?.slug || "");

  // Helper to check if event is BGMI or Free Fire
  const isBattleRoyale = (eventSlug: string) => {
    const event = events.find((e) => e.slug === eventSlug);
    if (!event) return false;
    const game = event.game?.toLowerCase() || "";
    return game.includes("bgmi") || game.includes("free fire") || game.includes("pubg");
  };

  return (
    <PageTransition>
      <section className="relative pt-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 scanlines pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
              Live Tournament Stats
            </p>
            <h1 className="text-4xl md:text-7xl font-bold">
              <GlitchText text="LEADERBOARD" className="text-foreground" />
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {events.map((event) => (
                <button
                  key={event.slug}
                  onClick={() => setActiveEvent(event.slug)}
                  className={`glitch-btn px-4 py-3 font-bold uppercase tracking-wider transition-all duration-300 text-sm md:text-base ${activeEvent === event.slug
                      ? "bg-secondary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>{event.game}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {activeEvent && (
            <div className="max-w-6xl mx-auto">
              {isBattleRoyale(activeEvent) ? (
                <EventLeaderboard
                  eventSlug={activeEvent}
                  eventName={events.find((e) => e.slug === activeEvent)?.game || ""}
                />
              ) : (
                <TournamentBracket eventSlug={activeEvent} />
              )}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Leaderboard;
