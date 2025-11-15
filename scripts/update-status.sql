-- SQL Migration to update project status from PLANNING to RECRUITING
-- Run this SQL query in your PostgreSQL database

-- Update all projects with PLANNING status to RECRUITING
UPDATE projects 
SET status = 'RECRUITING' 
WHERE status = 'PLANNING';

-- Verify the update
SELECT id, title, status, type, max_members 
FROM projects 
ORDER BY created_at DESC;
