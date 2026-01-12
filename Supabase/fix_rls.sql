-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON matches;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON matches;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON matches;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON match_scores;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON match_scores;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON match_scores;

CREATE POLICY "Enable all access for all users" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON match_scores FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_scores ENABLE ROW LEVEL SECURITY;
