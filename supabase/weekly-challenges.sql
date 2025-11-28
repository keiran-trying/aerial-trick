-- Weekly Challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  tutorial_ids UUID[] NOT NULL, -- Array of tutorial IDs
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('weekly', 'monthly')) DEFAULT 'weekly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_start_date ON weekly_challenges(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_end_date ON weekly_challenges(end_date);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_enabled ON weekly_challenges(is_enabled);

-- Enable Row Level Security
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read enabled challenges
CREATE POLICY "Weekly challenges are viewable by everyone" 
  ON weekly_challenges FOR SELECT 
  USING (true);

-- Only authenticated users can create/update/delete (for admin)
CREATE POLICY "Authenticated users can create weekly challenges" 
  ON weekly_challenges FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update weekly challenges" 
  ON weekly_challenges FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete weekly challenges" 
  ON weekly_challenges FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Trigger to automatically update updated_at
CREATE TRIGGER update_weekly_challenges_updated_at 
  BEFORE UPDATE ON weekly_challenges 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

