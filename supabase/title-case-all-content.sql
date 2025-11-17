-- 🎨 TITLE CASE ALL CONTENT
-- This script will convert all tutorial titles and collection names to Title Case

-- Step 1: Create a helper function for Title Case
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

-- Step 2: Update all tutorial titles to Title Case
UPDATE tutorials
SET title = title_case(title)
WHERE title != title_case(title);

-- Get count of updated tutorials
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM tutorials
  WHERE title = title_case(title);
  
  RAISE NOTICE '✅ Updated % tutorial titles to Title Case', updated_count;
END $$;

-- Step 3: Update all collection names to Title Case
UPDATE collections
SET name = title_case(name)
WHERE name != title_case(name);

-- Get count of updated collections
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM collections
  WHERE name = title_case(name);
  
  RAISE NOTICE '✅ Updated % collection names to Title Case', updated_count;
END $$;

-- Step 4: Clean up the helper function
DROP FUNCTION IF EXISTS title_case(TEXT);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🎉 All content is now in Title Case!';
  RAISE NOTICE 'Tutorial titles: "sneaky drop" → "Sneaky Drop"';
  RAISE NOTICE 'Collections: "open fabric" → "Open Fabric"';
END $$;

