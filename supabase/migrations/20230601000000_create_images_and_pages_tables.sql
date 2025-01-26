-- Create images table
CREATE TABLE images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_images_timestamp
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_pages_timestamp
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create index on slug for faster lookups
CREATE INDEX idx_pages_slug ON pages(slug);

-- Add RLS policies
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Images policies
CREATE POLICY "Allow select for all users" ON images FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON images FOR DELETE USING (auth.role() = 'authenticated');

-- Pages policies
CREATE POLICY "Allow select for published pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Allow all actions for authenticated users" ON pages TO authenticated USING (true) WITH CHECK (true);

