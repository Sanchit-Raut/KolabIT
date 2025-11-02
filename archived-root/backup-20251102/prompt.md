# KolabIT: Campus-Centric Skill-Sharing Platform - AI Builder Prompt

## Project Overview
Build KolabIT, a comprehensive web-based platform for campus-centric skill-sharing and collaborative learning. This platform will connect university students through skill-based collaboration, project partnerships, and community engagement.

## Technical Stack Requirements
- **Backend**: Express.js with TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL (recommended for production scalability)
- **Authentication**: JWT-based authentication
- **Real-time Communication**: Socket.io for notifications and messaging
- **File Storage**: Multer for file uploads with cloud storage integration

## Core Features & Backend Flow

### 1. User Management System
**Endpoints to implement:**
- `POST /api/auth/register` - Student registration with email verification
- `POST /api/auth/login` - Login with JWT token generation
- `POST /api/auth/logout` - Secure logout with token invalidation
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset initiation
- `PUT /api/auth/reset-password/:token` - Password reset completion
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users by skills, department, year

### 2. Skill Management System
**Endpoints to implement:**
- `GET /api/skills` - Get all available skills with categories
- `POST /api/skills` - Add new skill (admin/verified users)
- `POST /api/users/skills` - Add skill to user profile with proficiency level
- `DELETE /api/users/skills/:skillId` - Remove skill from profile
- `GET /api/users/:userId/skills` - Get user's skills
- `GET /api/skills/:skillId/users` - Find users with specific skill

### 3. Project Collaboration System
**Endpoints to implement:**
- `POST /api/projects` - Create new project
- `GET /api/projects` - Get projects with filters (skills, status, type)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (owner only)
- `DELETE /api/projects/:id` - Delete project (owner only)
- `POST /api/projects/:id/join-request` - Request to join project
- `PUT /api/projects/:id/join-request/:requestId` - Accept/reject join request
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/tasks` - Create project tasks
- `PUT /api/projects/:id/tasks/:taskId` - Update task status

### 4. Resource Sharing Hub
**Endpoints to implement:**
- `POST /api/resources` - Upload/share resource
- `GET /api/resources` - Get resources with filters (subject, type, semester)
- `GET /api/resources/:id` - Get resource details
- `PUT /api/resources/:id` - Update resource (owner only)
- `DELETE /api/resources/:id` - Delete resource (owner only)
- `POST /api/resources/:id/download` - Track downloads
- `POST /api/resources/:id/rating` - Rate resource
- `GET /api/resources/:id/ratings` - Get resource ratings

### 5. Community Bulletin Board
**Endpoints to implement:**
- `POST /api/posts` - Create community post
- `GET /api/posts` - Get posts with pagination and filters
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner/admin only)
- `POST /api/posts/:id/comments` - Add comment
- `PUT /api/posts/:id/comments/:commentId` - Update comment
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment
- `POST /api/posts/:id/like` - Like/unlike post

### 6. Gamification System
**Endpoints to implement:**
- `GET /api/badges` - Get all available badges
- `GET /api/users/:userId/badges` - Get user's badges
- `POST /api/users/badges/check` - Check and award badges
- `GET /api/leaderboard` - Get skill-based leaderboards
- `GET /api/users/:userId/achievements` - Get user achievements

### 7. Notification System
**Endpoints to implement:**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Schema (Prisma Models)

```prisma
// User model with comprehensive profile
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  rollNumber  String?  @unique
  department  String?
  year        Int?
  semester    Int?
  bio         String?
  avatar      String?
  isVerified  Boolean  @default(false)
  verificationToken String?
  resetToken  String?
  resetTokenExpiry DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userSkills     UserSkill[]
  ownedProjects  Project[]    @relation("ProjectOwner")
  projectMembers ProjectMember[]
  resources      Resource[]
  posts          Post[]
  comments       Comment[]
  likes          Like[]
  userBadges     UserBadge[]
  notifications  Notification[]
  joinRequests   JoinRequest[]
  sentMessages   Message[]    @relation("MessageSender")
  receivedMessages Message[] @relation("MessageReceiver")
  
  @@map("users")
}

model Skill {
  id          String   @id @default(cuid())
  name        String   @unique
  category    String
  description String?
  icon        String?
  createdAt   DateTime @default(now())
  
  userSkills     UserSkill[]
  projectSkills  ProjectSkill[]
  
  @@map("skills")
}

model UserSkill {
  id           String @id @default(cuid())
  userId       String
  skillId      String
  proficiency  String // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  yearsOfExp   Int?
  endorsements Int    @default(0)
  
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill Skill @relation(fields: [skillId], references: [id])
  
  @@unique([userId, skillId])
  @@map("user_skills")
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  status      String   // PLANNING, ACTIVE, COMPLETED, CANCELLED
  type        String   // ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP
  maxMembers  Int?
  startDate   DateTime?
  endDate     DateTime?
  githubUrl   String?
  liveUrl     String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  owner         User            @relation("ProjectOwner", fields: [ownerId], references: [id])
  members       ProjectMember[]
  requiredSkills ProjectSkill[]
  joinRequests  JoinRequest[]
  tasks         Task[]
  
  @@map("projects")
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  role      String   // MEMBER, COLLABORATOR, MAINTAINER
  joinedAt  DateTime @default(now())
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
  @@map("project_members")
}

model ProjectSkill {
  id        String @id @default(cuid())
  projectId String
  skillId   String
  required  Boolean @default(true)
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  skill   Skill   @relation(fields: [skillId], references: [id])
  
  @@unique([projectId, skillId])
  @@map("project_skills")
}

model Resource {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        String   // PDF, DOC, VIDEO, LINK, CODE
  subject     String
  semester    Int?
  fileUrl     String?
  fileName    String?
  fileSize    Int?
  downloads   Int      @default(0)
  uploaderId  String
  createdAt   DateTime @default(now())
  
  uploader User           @relation(fields: [uploaderId], references: [id])
  ratings  ResourceRating[]
  
  @@map("resources")
}

model ResourceRating {
  id         String @id @default(cuid())
  resourceId String
  userId     String
  rating     Int    // 1-5 stars
  review     String?
  
  resource Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([resourceId, userId])
  @@map("resource_ratings")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  type      String   // DISCUSSION, ANNOUNCEMENT, HELP, SHOWCASE
  tags      String[] // Array of tags
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  author   User      @relation(fields: [authorId], references: [id])
  comments Comment[]
  likes    Like[]
  
  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  postId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id])
  
  @@map("comments")
}

model Like {
  id     String @id @default(cuid())
  postId String
  userId String
  
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([postId, userId])
  @@map("likes")
}

model Badge {
  id          String @id @default(cuid())
  name        String @unique
  description String
  icon        String
  category    String // SKILL, CONTRIBUTION, ACHIEVEMENT, SPECIAL
  criteria    String // JSON string describing criteria
  
  userBadges UserBadge[]
  
  @@map("badges")
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())
  
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id])
  
  @@unique([userId, badgeId])
  @@map("user_badges")
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // PROJECT_INVITE, SKILL_ENDORSEMENT, BADGE_EARNED, etc.
  title     String
  message   String
  isRead    Boolean  @default(false)
  data      Json?    // Additional data as JSON
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}

model JoinRequest {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  message   String?
  status    String   // PENDING, ACCEPTED, REJECTED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
  @@map("join_requests")
}

model Task {
  id          String   @id @default(cuid())
  projectId   String
  title       String
  description String?
  status      String   // TODO, IN_PROGRESS, COMPLETED
  priority    String   // LOW, MEDIUM, HIGH, URGENT
  assigneeId  String?
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee User?   @relation(fields: [assigneeId], references: [id])
  
  @@map("tasks")
}

model Message {
  id         String   @id @default(cuid())
  content    String
  senderId   String
  receiverId String
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  sender   User @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User @relation("MessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)
  
  @@map("messages")
}
```

## Implementation Rules & Guidelines

### CRITICAL RULES - NO EXCEPTIONS:

1. **NO MOCK IMPLEMENTATIONS**: Every endpoint must have complete, functional implementation. No placeholder functions or TODO comments.

2. **NO HALLUCINATED FEATURES**: Only implement the features explicitly defined in this prompt. Do not add features not mentioned.

3. **COMPLETE ERROR HANDLING**: Every endpoint must include comprehensive error handling with appropriate HTTP status codes.

4. **PROPER VALIDATION**: Use express-validator or joi for all request validation. Validate all inputs.

5. **SECURITY FIRST**: 
   - Implement proper JWT authentication middleware
   - Use bcrypt for password hashing
   - Sanitize all user inputs
   - Implement rate limiting
   - Use CORS properly
   - Validate file uploads strictly

6. **DATABASE INTEGRITY**: 
   - Use Prisma transactions for complex operations
   - Implement proper foreign key constraints
   - Handle database errors gracefully
   - Use connection pooling

7. **TYPESCRIPT STRICT MODE**: 
   - Define proper interfaces for all data structures
   - Use strict TypeScript configuration
   - No `any` types allowed
   - Proper type definitions for all functions

### Code Structure Requirements:

```
src/
├── controllers/        # Route handlers
├── middleware/         # Authentication, validation, error handling
├── routes/            # Express routes
├── services/          # Business logic
├── utils/             # Helper functions
├── types/             # TypeScript interfaces
├── config/            # Database, environment configs
├── validators/        # Input validation schemas
└── app.ts             # Express app setup
```

### Authentication Middleware:
```typescript
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
```

### Error Response Format:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

### Required Middleware:
1. **Authentication middleware** for protected routes
2. **Validation middleware** for all POST/PUT requests
3. **Error handling middleware** for centralized error management
4. **Rate limiting middleware** for API protection
5. **File upload middleware** for resource management
6. **CORS middleware** for cross-origin requests

### Performance Requirements:
1. Implement proper database indexing
2. Use pagination for all list endpoints
3. Implement caching for frequently accessed data
4. Optimize database queries with proper relations
5. Use connection pooling for database

### Testing Requirements:
1. Write unit tests for all services
2. Write integration tests for all endpoints
3. Test authentication and authorization
4. Test error scenarios
5. Use Jest and Supertest for testing

### Environment Variables Required:
```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
BCRYPT_SALT_ROUNDS=
UPLOAD_PATH=
MAX_FILE_SIZE=
EMAIL_SERVICE_KEY=
CLIENT_URL=
```

## Specific Implementation Notes:

### Real-time Features:
Implement Socket.io for:
- Real-time notifications
- Project collaboration updates
- Live messaging system
- Online user status

### File Upload System:
- Validate file types and sizes
- Generate unique file names
- Implement virus scanning
- Support multiple file formats
- Implement file versioning for resources

### Search & Filtering:
- Implement full-text search for projects and resources
- Advanced filtering by skills, department, year
- Sorting options for all list endpoints
- Search history and suggestions

### Gamification Logic:
- Automatic badge assignment based on user activities
- Skill endorsement system
- Project completion tracking
- Community contribution scoring

Remember: This is a production-ready application. Every line of code must be complete, tested, and functional. No shortcuts or mock implementations are acceptable.