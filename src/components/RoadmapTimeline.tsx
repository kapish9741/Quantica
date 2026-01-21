import { motion } from "framer-motion";
import { useRoadmap } from "../hooks/useLeaderboard";
import { Calendar, CheckCircle, Clock, Circle, X } from "lucide-react";
import GlitchText from "./GlitchText";
import { GiSplitCross } from "react-icons/gi";

interface RoadmapTimelineProps {
  onClose?: () => void;
}

const RoadmapTimeline = ({ onClose }: RoadmapTimelineProps) => {
  const { roadmapItems, loading } = useRoadmap();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "ongoing":
        return <Clock className="w-5 h-5 text-secondary animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-l-green-500 bg-green-500/5";
      case "ongoing":
        return "border-l-secondary bg-secondary/5";
      default:
        return "border-l-muted bg-card/50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center mb-10"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-primary transition-colors duration-300 hover:rotate-90 transform"
            aria-label="Close schedule"
          >
            <GiSplitCross className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-3xl md:text-5xl font-bold mb-2 font-play">
          <GlitchText text="TOURNAMENT SCHEDULE" className="text-foreground" />
        </h2>
        <p className="text-muted-foreground">Follow the action live</p>
      </motion.div>

      <div className="relative space-y-4">
          {roadmapItems.map((item, index) => {
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

            return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden group rounded-r-lg border-l-4 ${getStatusColor(item.status)} border-y border-r border-border/50 hover:border-border transition-all duration-300`}
            >
              <div className="flex flex-col md:flex-row items-stretch"> 
                {/* Date & Time Column */}
                <div className="flex-shrink-0 w-full md:w-32 bg-black/20 flex flex-row md:flex-col items-center justify-center p-4 gap-2 md:gap-1 border-b md:border-b-0 md:border-r border-border/50 text-center">
                   <div className="text-lg font-bold text-primary tracking-wider uppercase">{dateStr}</div>
                   <div className="text-sm font-mono text-muted-foreground bg-background/50 px-2 py-0.5 rounded">{timeStr}</div>
                </div>

                {/* Content */}
                <div className="flex-grow p-5 flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-3 mb-1">
                        <h3 className="text-xl font-bold text-foreground truncate">
                          {item.title}
                        </h3>
                         <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            item.status === "completed"
                              ? "bg-green-500/10 text-green-500"
                              : item.status === "ongoing"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                </div>
              </div>
            </motion.div>
          )})}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
