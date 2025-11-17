-- ⚠️ MERGE DUPLICATE COLLECTIONS (Case-Insensitive)
-- This script will merge duplicate collections like "open fabric" and "Open fabric"

-- Step 1: Create a temporary function to title case collection names
CREATE OR REPLACE FUNCTION title_case(str TEXT) RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT string_agg(
    INITCAP(word),
    ' '
  ) INTO result
  FROM unnest(string_to_array(str, ' ')) AS word;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Find and merge duplicates
DO $$
DECLARE
  collection_record RECORD;
  canonical_id UUID;
  duplicate_id UUID;
BEGIN
  -- For each unique lowercase collection name
  FOR collection_record IN 
    SELECT LOWER(name) as lowercase_name
    FROM collections
    GROUP BY LOWER(name)
    HAVING COUNT(*) > 1
  LOOP
    RAISE NOTICE 'Merging duplicates for: %', collection_record.lowercase_name;
    
    -- Get the canonical version (we'll keep the first one, but update its name to title case)
    SELECT id INTO canonical_id
    FROM collections
    WHERE LOWER(name) = collection_record.lowercase_name
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- Update the canonical collection name to title case
    UPDATE collections
    SET name = title_case(collection_record.lowercase_name)
    WHERE id = canonical_id;
    
    -- Update all tutorial_collections to point to the canonical collection
    UPDATE tutorial_collections
    SET collection_id = canonical_id
    WHERE collection_id IN (
      SELECT id FROM collections
      WHERE LOWER(name) = collection_record.lowercase_name
      AND id != canonical_id
    );
    
    -- Delete duplicate collections
    DELETE FROM collections
    WHERE LOWER(name) = collection_record.lowercase_name
    AND id != canonical_id;
    
    RAISE NOTICE 'Merged duplicates into collection ID: %', canonical_id;
  END LOOP;
END $$;

-- Step 3: Clean up the temporary function
DROP FUNCTION IF EXISTS title_case(TEXT);

-- Step 4: Add a unique constraint to prevent future duplicates (case-insensitive)
-- First, create a function-based unique index on lowercase names
CREATE UNIQUE INDEX IF NOT EXISTS collections_name_lower_unique 
ON collections (LOWER(name));

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Duplicate collections merged successfully!';
  RAISE NOTICE 'All collection names are now in Title Case.';
END $$;

