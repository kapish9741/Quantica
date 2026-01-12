CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  total_points NUMERIC DEFAULT 0,
  total_kills INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, event_id)
);

CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  match_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
  scheduled_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, match_number)
);

CREATE TABLE IF NOT EXISTS match_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  placement INTEGER NOT NULL,
  kills INTEGER DEFAULT 0,
  points NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

CREATE TABLE IF NOT EXISTS points_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  kill_points NUMERIC DEFAULT 1,
  placement_points JSONB DEFAULT '{"1": 10, "2": 6, "3": 5, "4": 4, "5": 3, "6": 2, "7": 1, "8": 1}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_rank ON teams(rank);
CREATE INDEX IF NOT EXISTS idx_participants_team ON participants(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_event ON matches(event_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_match ON match_scores(match_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_team ON match_scores(team_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_date ON roadmap_items(date);

CREATE OR REPLACE FUNCTION update_team_rankings(p_event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE teams
  SET rank = ranked.new_rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY total_points DESC, total_kills DESC) as new_rank
    FROM teams
    WHERE event_id = p_event_id
  ) ranked
  WHERE teams.id = ranked.id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_team_points()
RETURNS TRIGGER AS $$
DECLARE
  v_kill_points NUMERIC;
  v_placement_points NUMERIC;
  v_total_points NUMERIC;
  v_event_id UUID;
BEGIN
  SELECT event_id INTO v_event_id
  FROM matches
  WHERE id = NEW.match_id;

  SELECT 
    kill_points,
    (placement_points->>NEW.placement::text)::NUMERIC
  INTO v_kill_points, v_placement_points
  FROM points_schemes
  WHERE event_id = v_event_id;

  v_kill_points := COALESCE(v_kill_points, 1);
  v_placement_points := COALESCE(v_placement_points, 0);

  v_total_points := (NEW.kills * v_kill_points) + v_placement_points;

  NEW.points := v_total_points;

  UPDATE teams
  SET 
    total_points = total_points + v_total_points,
    total_kills = total_kills + NEW.kills,
    wins = CASE WHEN NEW.placement = 1 THEN wins + 1 ELSE wins END
  WHERE id = NEW.team_id;

  PERFORM update_team_rankings(v_event_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_points
BEFORE INSERT ON match_scores
FOR EACH ROW
EXECUTE FUNCTION calculate_team_points();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON participants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON match_scores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON points_schemes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON roadmap_items FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON events FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON teams FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON teams FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON participants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON participants FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON participants FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON matches FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON matches FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON match_scores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON match_scores FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON match_scores FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON points_schemes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON points_schemes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON points_schemes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON roadmap_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON roadmap_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON roadmap_items FOR DELETE TO authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE match_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE roadmap_items;

INSERT INTO events (name, game, date, status, slug) VALUES
  ('BGMI', 'BGMI', '7-8 Feb 2026', 'upcoming', 'bgmi'),
  ('Valorant', 'Valorant', '7-8 Feb 2026', 'upcoming', 'valorant'),
  ('Free Fire MAX', 'Free Fire', '7-8 Feb 2026', 'upcoming', 'freefire'),
  ('EFootball', 'EFootball', '7-8 Feb 2026', 'upcoming', 'efootball'),
  ('Tekken 8', 'Tekken 8', '7-8 Feb 2026', 'upcoming', 'tekken8'),
  ('F1 - 25', 'F1 - 25', '7-8 Feb 2026', 'upcoming', 'f125'),
  ('Clash Royale', 'Clash Royale', '7-8 Feb 2026', 'upcoming', 'clashroyale'),
  ('EAFC 26', 'EAFC 26', '7-8 Feb 2026', 'upcoming', 'eafootball26')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO points_schemes (event_id, kill_points, placement_points)
SELECT 
  id,
  1,
  '{"1": 10, "2": 6, "3": 5, "4": 4, "5": 3, "6": 2, "7": 1, "8": 1}'::jsonb
FROM events
ON CONFLICT (event_id) DO NOTHING;

INSERT INTO roadmap_items (title, description, date, status) VALUES
  ('Tournament Registration Opens', 'Registration for all events begins', '2026-01-01 00:00:00+00', 'completed'),
  ('Practice Sessions', 'Teams can join practice lobbies', '2026-01-20 00:00:00+00', 'upcoming'),
  ('Tournament Day 1', 'First day of matches across all events', '2026-02-07 00:00:00+00', 'upcoming'),
  ('Tournament Day 2', 'Finals and prize distribution', '2026-02-08 00:00:00+00', 'upcoming')
ON CONFLICT DO NOTHING;
