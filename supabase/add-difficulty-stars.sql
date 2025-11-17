-- Add difficulty stars column to tutorials table
-- This allows sub-levels within each difficulty category (1-3 stars)

ALTER TABLE tutorials 
ADD COLUMN IF NOT EXISTS difficulty_stars INTEGER DEFAULT 1 CHECK (difficulty_stars >= 1 AND difficulty_stars <= 3);

-- Add a comment to explain the column
COMMENT ON COLUMN tutorials.difficulty_stars IS 'Sub-level difficulty rating: 1 = easiest within category, 2 = moderate, 3 = hardest within category';

-- Update existing tutorials to have 1 star by default (can be changed later)
UPDATE tutorials 
SET difficulty_stars = 1 
WHERE difficulty_stars IS NULL;

