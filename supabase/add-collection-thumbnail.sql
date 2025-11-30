-- Add thumbnail_url column to collections table
-- This allows collections to store a thumbnail that gets updated when new tutorials are added

ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Optionally: populate existing collections with their newest tutorial's thumbnail
DO $$
DECLARE
  collection_record RECORD;
  newest_thumbnail TEXT;
BEGIN
  FOR collection_record IN 
    SELECT id FROM collections
  LOOP
    -- Get the newest tutorial's thumbnail for this collection
    SELECT t.thumbnail_url INTO newest_thumbnail
    FROM tutorial_collections tc
    JOIN tutorials t ON t.id = tc.tutorial_id
    WHERE tc.collection_id = collection_record.id
    ORDER BY t.created_at DESC
    LIMIT 1;
    
    -- Update the collection's thumbnail
    IF newest_thumbnail IS NOT NULL THEN
      UPDATE collections
      SET thumbnail_url = newest_thumbnail
      WHERE id = collection_record.id;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Collection thumbnails updated!';
END $$;

SELECT 'Collection thumbnail column added successfully!' AS status;

