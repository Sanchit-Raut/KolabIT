-- ============================================
-- ADMIN FEATURE MIGRATION
-- This file alters the existing schema to add admin functionality
-- Run this on your existing PostgreSQL database
-- ============================================

-- Step 1: Add new columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'USER',
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_admins_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 3: Create user_bans table
CREATE TABLE IF NOT EXISTS user_bans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  banned_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  banned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_permanent BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_user_bans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_bans_admin FOREIGN KEY (banned_by) REFERENCES users(id)
);

-- Step 4: Create user_warnings table
CREATE TABLE IF NOT EXISTS user_warnings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_warnings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_warnings_admin FOREIGN KEY (issued_by) REFERENCES users(id)
);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_issued_by ON user_warnings(issued_by);

-- Step 6: Add comments to tables
COMMENT ON TABLE admins IS 'Stores admin users with special permissions';
COMMENT ON TABLE user_bans IS 'Tracks banned users with ban details';
COMMENT ON TABLE user_warnings IS 'Warning system for user moderation';

-- Step 7: (Optional) Create admin user - Update email/password as needed
-- Uncomment and modify the following lines to create an admin user

/*
-- First, insert the admin user into users table
INSERT INTO users (email, password, first_name, last_name, role, is_verified, created_at, updated_at)
VALUES (
  'admin@kolabit.com', 
  '$2b$10$hashed_password_here',  -- Replace with actual bcrypt hashed password
  'Admin',
  'User',
  'ADMIN',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET role = 'ADMIN';

-- Then create admin record
INSERT INTO admins (user_id, permissions, is_active, created_at, updated_at)
SELECT 
  id,
  '{"canBanUsers": true, "canDeleteContent": true, "canWarnUsers": true}'::jsonb,
  true,
  NOW(),
  NOW()
FROM users
WHERE email = 'admin@kolabit.com'
ON CONFLICT (user_id) DO NOTHING;
*/

-- Step 8: Verify migration
-- Run these queries to check if migration was successful

/*
SELECT 'users table updated' as status, 
  COUNT(*) FILTER (WHERE role IS NOT NULL) as users_with_role,
  COUNT(*) FILTER (WHERE is_banned IS NOT NULL) as users_with_banned_flag
FROM users;

SELECT 'admins table created' as status, COUNT(*) as admin_count FROM admins;
SELECT 'user_bans table created' as status, COUNT(*) as ban_count FROM user_bans;
SELECT 'user_warnings table created' as status, COUNT(*) as warning_count FROM user_warnings;
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
