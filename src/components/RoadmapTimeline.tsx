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
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "ongoing":
        return <Clock className="w-6 h-6 text-secondary animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-500/10";
      case "ongoing":
        return "border-secondary bg-secondary/10";
      default:
        return "border-border bg-card";
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
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center mb-8"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-primary transition-colors duration-300 hover:rotate-90 transform"
            aria-label="Close roadmap"
          >
            <GiSplitCross className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-3xl md:text-5xl font-bold mb-2 font-play">
          <GlitchText text="TOURNAMENT ROADMAP" className="text-foreground" />
        </h2>
        <p className="text-muted-foreground">Track the tournament progress</p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-8">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute left-8 top-6 w-4 h-4 -ml-2 rounded-full border-4 border-background bg-primary hidden md:block z-10" />

              <div className="md:ml-20">
                <div
                  className={`p-6 border-2 clip-corner ${getStatusColor(
                    item.status
                  )} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {item.title}
                        </h3>
                        <span
                          className={`text-xs uppercase px-2 py-1 rounded ${
                            item.status === "completed"
                              ? "bg-green-500/20 text-green-500"
                              : item.status === "ongoing"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline;
