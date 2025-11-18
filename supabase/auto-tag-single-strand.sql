-- 🪢 AUTO-TAG TUTORIALS AS "SINGLE STRAND"
-- This script tags all tutorials that DON'T have "Open Fabric" as "Single Strand"

DO $$
DECLARE
  v_single_strand_id UUID;
  v_open_fabric_id UUID;
  v_tutorial RECORD;
BEGIN
  -- Get or create "Single Strand" collection
  SELECT id INTO v_single_strand_id
  FROM collections
  WHERE LOWER(name) = 'single strand';
  
  IF v_single_strand_id IS NULL THEN
    INSERT INTO collections (name, description)
    VALUES ('Single Strand', 'Tutorials using fabric as a rope (not opened)')
    RETURNING id INTO v_single_strand_id;
    
    RAISE NOTICE 'Created Single Strand collection with ID: %', v_single_strand_id;
  ELSE
    RAISE NOTICE 'Found existing Single Strand collection with ID: %', v_single_strand_id;
  END IF;
  
  -- Get "Open Fabric" collection ID (if it exists)
  SELECT id INTO v_open_fabric_id
  FROM collections
  WHERE LOWER(name) = 'open fabric';
  
  IF v_open_fabric_id IS NULL THEN
    RAISE NOTICE 'No "Open Fabric" collection found - will tag ALL tutorials as Single Strand';
  ELSE
    RAISE NOTICE 'Found Open Fabric collection with ID: %', v_open_fabric_id;
  END IF;
  
  -- Tag all tutorials that DON'T have "Open Fabric"
  FOR v_tutorial IN
    SELECT DISTINCT t.id, t.title
    FROM tutorials t
    WHERE NOT EXISTS (
      -- Tutorial is NOT in "Open Fabric" collection
      SELECT 1
      FROM tutorial_collections tc
      WHERE tc.tutorial_id = t.id
        AND tc.collection_id = v_open_fabric_id
    )
  LOOP
    -- Insert into tutorial_collections if not already there
    INSERT INTO tutorial_collections (tutorial_id, collection_id)
    VALUES (v_tutorial.id, v_single_strand_id)
    ON CONFLICT (tutorial_id, collection_id) DO NOTHING;
    
    RAISE NOTICE 'Tagged tutorial: %', v_tutorial.title;
  END LOOP;
  
  RAISE NOTICE 'Auto-tagging complete!';
END $$;

-- Show results
SELECT 
  c.name AS collection_name,
  COUNT(tc.tutorial_id) AS tutorial_count
FROM collections c
LEFT JOIN tutorial_collections tc ON c.id = tc.collection_id
WHERE LOWER(c.name) IN ('single strand', 'open fabric')
GROUP BY c.name
ORDER BY c.name;

