-- Enable extension for gen_random_uuid (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  roll_number TEXT UNIQUE,
  department TEXT,
  year INTEGER,
  semester INTEGER,
  bio TEXT,
  avatar TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: user_skills
CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  years_of_exp INTEGER,
  endorsements INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id),
  CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  max_members INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  github_url TEXT,
  live_url TEXT,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Table: project_members
CREATE TABLE IF NOT EXISTS project_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_project_member UNIQUE (project_id, user_id),
  CONSTRAINT fk_project_members_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: project_skills
CREATE TABLE IF NOT EXISTS project_skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT uq_project_skill UNIQUE (project_id, skill_id),
  CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Table: resources
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester INTEGER,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  downloads INTEGER NOT NULL DEFAULT 0,
  uploader_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_resources_uploader FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- Table: resource_ratings
CREATE TABLE IF NOT EXISTS resource_ratings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  resource_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review TEXT,
  CONSTRAINT uq_resource_rating UNIQUE (resource_id, user_id),
  CONSTRAINT fk_resource_ratings_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  CONSTRAINT fk_resource_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  author_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Table: likes
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  CONSTRAINT uq_like UNIQUE (post_id, user_id),
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  criteria TEXT NOT NULL
);

-- Table: user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id),
  CONSTRAINT fk_user_badges_badge FOREIGN KEY (badge_id) REFERENCES badges(id),
  CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: join_requests
CREATE TABLE IF NOT EXISTS join_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_join_request UNIQUE (project_id, user_id),
  CONSTRAINT fk_join_requests_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_join_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assignee_id TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================
-- 1. SKILLS (with auto-generated UUIDs)
-- ============================================

-- Frontend Skills
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('React', 'Frontend', 'JavaScript library for building user interfaces', '⚛️', NOW()),
('Next.js', 'Frontend', 'React framework for production', '▲', NOW()),
('Vue.js', 'Frontend', 'Progressive JavaScript framework', '💚', NOW()),
('Angular', 'Frontend', 'Platform for building web applications', '🅰️', NOW()),
('HTML5', 'Frontend', 'Hypertext Markup Language', '🌐', NOW()),
('CSS3', 'Frontend', 'Cascading Style Sheets', '🎨', NOW()),
('Tailwind CSS', 'Frontend', 'Utility-first CSS framework', '🌊', NOW()),
('Bootstrap', 'Frontend', 'CSS framework for responsive design', '🅱️', NOW()),
('SASS/SCSS', 'Frontend', 'CSS preprocessor', '💅', NOW()),
('TypeScript', 'Frontend', 'Typed superset of JavaScript', '🔷', NOW());

-- Backend Skills
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('Node.js', 'Backend', 'JavaScript runtime environment', '🟢', NOW()),
('Express.js', 'Backend', 'Web framework for Node.js', '🚂', NOW()),
('Python', 'Backend', 'High-level programming language', '🐍', NOW()),
('Django', 'Backend', 'Python web framework', '🎸', NOW()),
('Flask', 'Backend', 'Lightweight Python web framework', '🧪', NOW()),
('Java', 'Backend', 'Object-oriented programming language', '☕', NOW()),
('Spring Boot', 'Backend', 'Java framework for microservices', '🍃', NOW()),
('PHP', 'Backend', 'Server-side scripting language', '🐘', NOW()),
('Laravel', 'Backend', 'PHP web framework', '🔺', NOW()),
('Ruby on Rails', 'Backend', 'Web application framework', '💎', NOW());

-- Database Skills
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('MySQL', 'Database', 'Relational database management system', '🐬', NOW()),
('PostgreSQL', 'Database', 'Advanced open-source database', '🐘', NOW()),
('MongoDB', 'Database', 'NoSQL document database', '🍃', NOW()),
('Redis', 'Database', 'In-memory data structure store', '🔴', NOW()),
('Firebase', 'Database', 'Google cloud platform', '🔥', NOW()),
('Prisma', 'Database', 'Next-generation ORM', '💎', NOW());

-- Mobile Development
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('React Native', 'Mobile', 'Framework for native mobile apps', '📱', NOW()),
('Flutter', 'Mobile', 'UI toolkit for mobile apps', '🦋', NOW()),
('Swift', 'Mobile', 'Programming language for iOS', '🍎', NOW()),
('Kotlin', 'Mobile', 'Modern language for Android', '🤖', NOW()),
('Android Development', 'Mobile', 'Native Android development', '🟢', NOW()),
('iOS Development', 'Mobile', 'Native iOS development', '📱', NOW());

-- DevOps & Cloud
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('Docker', 'DevOps', 'Containerization platform', '🐳', NOW()),
('Kubernetes', 'DevOps', 'Container orchestration', '☸️', NOW()),
('AWS', 'DevOps', 'Amazon Web Services', '☁️', NOW()),
('Google Cloud', 'DevOps', 'Google Cloud Platform', '☁️', NOW()),
('Azure', 'DevOps', 'Microsoft Azure', '☁️', NOW()),
('Git', 'DevOps', 'Version control system', '📦', NOW()),
('GitHub', 'DevOps', 'Code hosting platform', '🐙', NOW()),
('GitLab', 'DevOps', 'DevOps platform', '🦊', NOW()),
('Jenkins', 'DevOps', 'Automation server', '🔧', NOW()),
('Linux', 'DevOps', 'Unix-like operating system', '🐧', NOW());

-- Data Science & AI
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('Machine Learning', 'Data Science', 'AI and ML algorithms', '🤖', NOW()),
('TensorFlow', 'Data Science', 'Machine learning framework', '🧠', NOW()),
('PyTorch', 'Data Science', 'Deep learning framework', '🔥', NOW()),
('Pandas', 'Data Science', 'Data analysis library', '🐼', NOW()),
('NumPy', 'Data Science', 'Numerical computing library', '🔢', NOW()),
('Data Analysis', 'Data Science', 'Analyzing and interpreting data', '📊', NOW()),
('Data Visualization', 'Data Science', 'Visual data representation', '📈', NOW());

-- Design Skills
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('Figma', 'Design', 'Collaborative design tool', '🎨', NOW()),
('Adobe XD', 'Design', 'UI/UX design tool', '🎨', NOW()),
('Photoshop', 'Design', 'Image editing software', '🖼️', NOW()),
('Illustrator', 'Design', 'Vector graphics editor', '🎨', NOW()),
('UI/UX Design', 'Design', 'User interface and experience design', '✨', NOW()),
('Graphic Design', 'Design', 'Visual communication design', '🎨', NOW());

-- Programming Languages
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('JavaScript', 'Programming', 'Dynamic programming language', '📜', NOW()),
('C++', 'Programming', 'High-performance programming', '⚡', NOW()),
('C Programming', 'Programming', 'General-purpose language', '©️', NOW()),
('C#', 'Programming', '.NET programming language', '#️⃣', NOW()),
('Go (Golang)', 'Programming', 'Systems programming language', '🔵', NOW()),
('Rust', 'Programming', 'Memory-safe programming', '🦀', NOW()),
('R Programming', 'Programming', 'Statistical computing language', '📊', NOW());

-- Testing & Quality
INSERT INTO skills (name, category, description, icon, created_at) VALUES
('Jest', 'Testing', 'JavaScript testing framework', '🃏', NOW()),
('Software Testing', 'Testing', 'Quality assurance and testing', '✅', NOW()),
('Selenium', 'Testing', 'Browser automation', '🧪', NOW());

-- ============================================
-- 2. BADGES (UUID auto-generated by Prisma)
-- ============================================

-- Skill Badges
INSERT INTO badges (name, description, icon, category, criteria) VALUES
('Skill Starter', 'Added your first skill to profile', '🎯', 'SKILL', '{"minSkills": 1}'),
('Skill Master', 'Added 5 or more skills', '🏆', 'SKILL', '{"minSkills": 5}'),
('Skill Expert', 'Have an EXPERT level skill', '⭐', 'SKILL', '{"minProficiency": "EXPERT"}'),
('Well Endorsed', 'Received 10 or more endorsements', '👍', 'SKILL', '{"minEndorsements": 10}');

-- Contribution Badges
INSERT INTO badges (name, description, icon, category, criteria) VALUES
('Project Pioneer', 'Joined your first project', '🚀', 'SPECIAL', '{"type": "FIRST_PROJECT"}'),
('Project Creator', 'Created your first project', '✨', 'CONTRIBUTION', '{"minProjects": 1}'),
('Active Contributor', 'Joined 3 or more projects', '💪', 'CONTRIBUTION', '{"minProjects": 3}'),
('Resource Sharer', 'Uploaded your first resource', '📚', 'SPECIAL', '{"type": "FIRST_RESOURCE"}'),
('Helper', 'Uploaded 5 or more resources', '🤝', 'CONTRIBUTION', '{"minResources": 5}'),
('Community Member', 'Created your first post', '💬', 'SPECIAL', '{"type": "FIRST_POST"}'),
('Discussion Starter', 'Created 10 or more posts', '🗣️', 'CONTRIBUTION', '{"minPosts": 10}');

-- Achievement Badges
INSERT INTO badges (name, description, icon, category, criteria) VALUES
('Popular Resource', 'Resource downloaded 50+ times', '🌟', 'ACHIEVEMENT', '{"minDownloads": 50}'),
('Viral Content', 'Post received 20+ likes', '🔥', 'ACHIEVEMENT', '{"minLikes": 20}'),
('Quality Creator', 'Received 10+ ratings on resources', '⭐', 'ACHIEVEMENT', '{"minRatings": 10}');

-- Special Badges
INSERT INTO badges (name, description, icon, category, criteria) VALUES
('Verified User', 'Verified your email address', '✓', 'SPECIAL', '{"type": "VERIFIED_USER"}'),
('Early Adopter', 'One of the first users of KolabIT', '🎖️', 'SPECIAL', '{"type": "EARLY_ADOPTER"}');


-- Optional: add commonly useful indexes for FK columns (improves join performance)
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_resources_uploader_id ON resources(uploader_id);
CREATE INDEX IF NOT EXISTS idx_resource_ratings_resource_id ON resource_ratings(resource_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_project_id ON join_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user_id ON join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);