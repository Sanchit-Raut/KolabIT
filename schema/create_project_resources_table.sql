-- Migration: Create project_resources table
-- This table links resources to projects

CREATE TABLE IF NOT EXISTS project_resources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, resource_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_resources_project_id ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_resource_id ON project_resources(resource_id);

-- Add comment to table
COMMENT ON TABLE project_resources IS 'Links resources to projects for easy access by project members';


