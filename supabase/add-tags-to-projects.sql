-- Add tags column to projects table
-- Run this in Supabase SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for tags
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN (tags);

-- Comment
COMMENT ON COLUMN projects.tags IS 'SEO and categorization tags (separate from tech_stack)';
