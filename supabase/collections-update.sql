-- Update database to support multiple collections per tutorial

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS tutorial_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tutorial_id, collection_id)
);

-- Migrate existing collections from tutorials table
INSERT INTO collections (name)
SELECT DISTINCT collection 
FROM tutorials 
WHERE collection IS NOT NULL AND collection != ''
ON CONFLICT (name) DO NOTHING;

-- Migrate existing tutorial-collection relationships
INSERT INTO tutorial_collections (tutorial_id, collection_id)
SELECT t.id, c.id
FROM tutorials t
JOIN collections c ON c.name = t.collection
WHERE t.collection IS NOT NULL AND t.collection != ''
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tutorial_collections_tutorial_id ON tutorial_collections(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_collections_collection_id ON tutorial_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_collections_name ON collections(name);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create collections" ON collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update collections" ON collections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete collections" ON collections FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for tutorial_collections
CREATE POLICY "Tutorial collections are viewable by everyone" ON tutorial_collections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tutorial collections" ON tutorial_collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete tutorial collections" ON tutorial_collections FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to update updated_at
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Collections system updated! Tutorials can now have multiple collections.' AS status;

