-- Add star rating column to tutorials table
-- This allows sub-levels within each difficulty: ⭐️ (1), ⭐️⭐️ (2), ⭐️⭐️⭐️ (3)

-- Add the stars column (1-3 stars)
ALTER TABLE tutorials
ADD COLUMN IF NOT EXISTS difficulty_stars INTEGER DEFAULT 1 CHECK (difficulty_stars >= 1 AND difficulty_stars <= 3);

-- Update existing tutorials to have 2 stars by default (medium within their difficulty)
UPDATE tutorials
SET difficulty_stars = 2
WHERE difficulty_stars IS NULL;

-- Make it NOT NULL after setting defaults
ALTER TABLE tutorials
ALTER COLUMN difficulty_stars SET NOT NULL;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty_stars ON tutorials(difficulty, difficulty_stars);

-- Add a comment to explain the column
COMMENT ON COLUMN tutorials.difficulty_stars IS 'Star rating within difficulty level: 1 (⭐️), 2 (⭐️⭐️), 3 (⭐️⭐️⭐️)';

