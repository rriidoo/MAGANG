/*
  # Create Content Management Table

  1. New Tables
    - `content_items`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Unique identifier for the content (e.g., 'hero_title', 'about_description')
      - `type` (text) - Type of content: 'text', 'image', 'link'
      - `value` (text) - The actual content value (text content, image URL, or link URL)
      - `label` (text) - Human-readable label for admin panel
      - `section` (text) - Section of website (hero, about, positions, etc.)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `content_items` table
    - Allow public to read content (for displaying on website)
    - Only authenticated users (admins) can insert/update/delete

  3. Notes
    - Public users can only view content
    - Only authenticated admins can manage content
*/

CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'image', 'link')),
  value text NOT NULL,
  label text NOT NULL,
  section text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read content (for displaying on website)
CREATE POLICY "Anyone can read content"
  ON content_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (admins) can insert content
CREATE POLICY "Authenticated users can insert content"
  ON content_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users (admins) can update content
CREATE POLICY "Authenticated users can update content"
  ON content_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admins) can delete content
CREATE POLICY "Authenticated users can delete content"
  ON content_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for key lookups
CREATE INDEX IF NOT EXISTS idx_content_items_key ON content_items(key);

-- Create index for section filtering
CREATE INDEX IF NOT EXISTS idx_content_items_section ON content_items(section);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_content_items_updated_at();

-- Enable Realtime for content_items table (for auto-update without page reload)
ALTER PUBLICATION supabase_realtime ADD TABLE content_items;

