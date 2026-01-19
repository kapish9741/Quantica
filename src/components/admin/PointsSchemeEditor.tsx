
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import api from "../../lib/api";
import { Event } from "../../hooks/useLeaderboard"; // Reuse types

// Interface for PointsScheme
interface PointsScheme {
  id: string;
  eventId: string;
  killPoints: number;
  placementPoints: Record<string, number>;
}

const PointsSchemeEditor = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [killPoints, setKillPoints] = useState(1);
  const [placementPoints, setPlacementPoints] = useState<Record<string, number>>({
    "1": 10,
    "2": 6,
    "3": 5,
    "4": 4,
    "5": 3,
    "6": 2,
    "7": 1,
    "8": 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchPointsScheme();
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

  const fetchPointsScheme = async () => {
    try {
      const { data } = await api.get<PointsScheme | null>(`/points-schemes?eventId=${selectedEvent}`);
      if (data) {
        setKillPoints(data.killPoints);
        setPlacementPoints(data.placementPoints);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlacementChange = (placement: string, points: number) => {
    setPlacementPoints(prev => ({
      ...prev,
      [placement]: points
    }));
  };

  const handleSave = async () => {
    if (!selectedEvent) return;

    setSaving(true);

    try {
      await api.post('/points-schemes', {
        eventId: selectedEvent,
        killPoints,
        placementPoints,
      });

      alert('Points scheme saved successfully!');
    } catch (error) {
      console.error('Error saving points scheme:', error);
      alert('Failed to save points scheme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Points Scheme Editor</h2>
        <button
          onClick={handleSave}
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
              Save Scheme
            </>
          )}
        </button>
      </div>

      {/* Event Selector */}
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

      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-card border-2 border-border p-6">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              Kill Points
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Points per kill:</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={killPoints}
                onChange={(e) => setKillPoints(parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-2 bg-background border-2 border-border focus:border-primary outline-none text-foreground text-center font-bold text-xl"
              />
            </div>
          </div>

          <div className="bg-card border-2 border-border p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Position Points</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(placementPoints).map((placement) => (
                <div key={placement} className="space-y-2">
                  <label className="block text-sm text-muted-foreground text-center">
                    #{placement} Place
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={placementPoints[placement]}
                    onChange={(e) =>
                      handlePlacementChange(placement, parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 bg-background border-2 border-border focus:border-primary outline-none text-foreground text-center font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview Example */}
          <div className="bg-muted border-2 border-border p-6">
            <h4 className="font-bold text-foreground mb-3">Example Calculation</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Team finishes in <strong className="text-primary">1st place</strong> with{" "}
                <strong className="text-secondary">5 kills</strong>:
              </p>
              <p className="text-foreground font-mono">
                = {placementPoints["1"]} (placement) + ({killPoints} × 5) (kills)
              </p>
              <p className="text-2xl font-bold text-secondary">
                = {placementPoints["1"] + (killPoints * 5)} points
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PointsSchemeEditor;
