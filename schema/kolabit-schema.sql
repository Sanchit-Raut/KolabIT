-- kolabit_schema.sql
-- Generated from Prisma schema (converted for PostgreSQL)
-- Run in your PostgreSQL DB (e.g., create database kolabit_test; then run this)

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  rollNumber TEXT UNIQUE,
  department TEXT,
  year INTEGER,
  semester INTEGER,
  bio TEXT,
  avatar TEXT,
  isVerified BOOLEAN NOT NULL DEFAULT false,
  verificationToken TEXT,
  resetToken TEXT,
  resetTokenExpiry TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- BADGES
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  criteria TEXT NOT NULL
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  maxMembers INTEGER,
  startDate TIMESTAMP WITH TIME ZONE,
  endDate TIMESTAMP WITH TIME ZONE,
  githubUrl TEXT,
  liveUrl TEXT,
  ownerId TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_projects_owner FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE RESTRICT
);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  authorId TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_posts_author FOREIGN KEY(authorId) REFERENCES users(id) ON DELETE RESTRICT
);

-- RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester INTEGER,
  fileUrl TEXT,
  fileName TEXT,
  fileSize INTEGER,
  downloads INTEGER NOT NULL DEFAULT 0,
  uploaderId TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_resources_uploader FOREIGN KEY(uploaderId) REFERENCES users(id) ON DELETE RESTRICT
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  postId TEXT NOT NULL,
  authorId TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_comments_author FOREIGN KEY(authorId) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_comments_post FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- LIKES (unique per postId,userId)
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  postId TEXT NOT NULL,
  userId TEXT NOT NULL,
  CONSTRAINT fk_likes_post FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT likes_unique_post_user UNIQUE (postId, userId)
);

-- PROJECT_MEMBERS (unique per projectId,userId)
CREATE TABLE IF NOT EXISTS project_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  projectId TEXT NOT NULL,
  userId TEXT NOT NULL,
  role TEXT NOT NULL,
  joinedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_pm_project FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT pm_unique_project_user UNIQUE (projectId, userId)
);

-- PROJECT_SKILLS (unique per projectId,skillId)
CREATE TABLE IF NOT EXISTS project_skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  projectId TEXT NOT NULL,
  skillId TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT fk_ps_project FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_skill FOREIGN KEY(skillId) REFERENCES skills(id) ON DELETE RESTRICT,
  CONSTRAINT ps_unique_project_skill UNIQUE (projectId, skillId)
);

-- USER_SKILLS (unique per userId,skillId)
CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  userId TEXT NOT NULL,
  skillId TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  yearsOfExp INTEGER,
  endorsements INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_us_skill FOREIGN KEY(skillId) REFERENCES skills(id) ON DELETE RESTRICT,
  CONSTRAINT fk_us_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT us_unique_user_skill UNIQUE (userId, skillId)
);

-- JOIN_REQUESTS (unique per projectId,userId)
CREATE TABLE IF NOT EXISTS join_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  projectId TEXT NOT NULL,
  userId TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_jr_project FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_jr_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT jr_unique_project_user UNIQUE (projectId, userId)
);

-- RESOURCE_RATINGS (unique per resourceId,userId)
CREATE TABLE IF NOT EXISTS resource_ratings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  resourceId TEXT NOT NULL,
  userId TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review TEXT,
  CONSTRAINT fk_rr_resource FOREIGN KEY(resourceId) REFERENCES resources(id) ON DELETE CASCADE,
  CONSTRAINT fk_rr_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT rr_unique_resource_user UNIQUE (resourceId, userId)
);

-- USER_BADGES (unique per userId,badgeId)
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  userId TEXT NOT NULL,
  badgeId TEXT NOT NULL,
  earnedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_ub_badge FOREIGN KEY(badgeId) REFERENCES badges(id) ON DELETE RESTRICT,
  CONSTRAINT fk_ub_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ub_unique_user_badge UNIQUE (userId, badgeId)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_notifications_user FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  projectId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assigneeId TEXT,
  dueDate TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_tasks_project FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_assignee FOREIGN KEY(assigneeId) REFERENCES users(id) ON DELETE SET NULL
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  senderId TEXT NOT NULL,
  receiverId TEXT NOT NULL,
  isRead BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_messages_receiver FOREIGN KEY(receiverId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY(senderId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes (optional helpful indexes)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(ownerId);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(authorId);
CREATE INDEX IF NOT EXISTS idx_resources_uploader ON resources(uploaderId);
