# KolabIT - Complete Backend Integration Package

This document provides everything needed to integrate the frontend with the KolabIT backend.

---

## 📋 Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [Data Relationships](#data-relationships)
3. [Backend Services Summary](#backend-services-summary)
4. [API Endpoints Quick Reference](#api-endpoints-quick-reference)
5. [Frontend Integration Checklist](#frontend-integration-checklist)

---

## 1. Database Schema Overview

### Core Tables

#### **users** (Central entity)
```
- id: UUID (auto-generated)
- email: string (unique)
- password: string (hashed)
- firstName: string
- lastName: string
- rollNumber: string? (unique, optional)
- department: string?
- year: integer?
- semester: integer?
- bio: text?
- avatar: string? (URL)
- isVerified: boolean (default: false)
- verificationToken: string?
- resetToken: string?
- resetTokenExpiry: timestamp?
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Has many: userSkills, ownedProjects, projectMembers, posts, comments, 
            resources, notifications, userBadges, certifications, portfolios
→ Has one: analytics
```

#### **skills**
```
- id: UUID
- name: string (unique)
- category: string
- description: text?
- icon: string?
- createdAt: timestamp

Relations:
→ Has many: userSkills, projectSkills
```

#### **user_skills** (Join table: users ↔ skills)
```
- id: UUID
- userId: UUID (foreign key → users)
- skillId: UUID (foreign key → skills)
- proficiency: string (BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)
- yearsOfExp: integer?
- endorsements: integer (default: 0)

Unique: (userId, skillId)
```

#### **projects**
```
- id: UUID
- title: string
- description: text
- status: string (RECRUITING|ACTIVE|COMPLETED|CANCELLED)
- type: string (ACADEMIC|PERSONAL|COMPETITION|INTERNSHIP)
- maxMembers: integer?
- startDate: timestamp?
- endDate: timestamp?
- githubUrl: string?
- liveUrl: string?
- ownerId: UUID (foreign key → users)
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: owner (User)
→ Has many: members, requiredSkills, tasks, joinRequests
```

#### **project_members** (Join table: projects ↔ users)
```
- id: UUID
- projectId: UUID (foreign key → projects)
- userId: UUID (foreign key → users)
- role: string (MEMBER|COLLABORATOR|MAINTAINER)
- joinedAt: timestamp

Unique: (projectId, userId)
```

#### **project_skills** (Join table: projects ↔ skills)
```
- id: UUID
- projectId: UUID (foreign key → projects)
- skillId: UUID (foreign key → skills)
- required: boolean (default: true)

Unique: (projectId, skillId)
```

#### **tasks**
```
- id: UUID
- projectId: UUID (foreign key → projects)
- title: string
- description: text?
- status: string (TODO|IN_PROGRESS|COMPLETED)
- priority: string (LOW|MEDIUM|HIGH|URGENT)
- assigneeId: UUID? (foreign key → users)
- dueDate: timestamp?
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: project, assignee (User)?
```

#### **resources**
```
- id: UUID
- title: string
- description: text?
- type: string (PDF|DOC|VIDEO|LINK|CODE)
- subject: string
- semester: integer?
- fileUrl: string?
- fileName: string?
- fileSize: integer?
- downloads: integer (default: 0)
- uploaderId: UUID (foreign key → users)
- createdAt: timestamp

Relations:
→ Belongs to: uploader (User)
→ Has many: ratings
```

#### **resource_ratings** (Join table: resources ↔ users)
```
- id: UUID
- resourceId: UUID (foreign key → resources)
- userId: UUID (foreign key → users)
- rating: integer (1-5)
- review: text?

Unique: (resourceId, userId)
```

#### **posts**
```
- id: UUID
- title: string
- content: text
- type: string (DISCUSSION|ANNOUNCEMENT|HELP|SHOWCASE)
- tags: string[] (array)
- authorId: UUID (foreign key → users)
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: author (User)
→ Has many: comments, likes
```

#### **comments**
```
- id: UUID
- content: text
- postId: UUID (foreign key → posts)
- authorId: UUID (foreign key → users)
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: post, author (User)
```

#### **likes** (Join table: posts ↔ users)
```
- id: UUID
- postId: UUID (foreign key → posts)
- userId: UUID (foreign key → users)

Unique: (postId, userId)
```

#### **badges**
```
- id: UUID
- name: string (unique)
- description: text
- icon: string
- category: string (SKILL|CONTRIBUTION|ACHIEVEMENT|SPECIAL)
- criteria: text (JSON string)

Relations:
→ Has many: userBadges
```

#### **user_badges** (Join table: users ↔ badges)
```
- id: UUID
- userId: UUID (foreign key → users)
- badgeId: UUID (foreign key → badges)
- earnedAt: timestamp

Unique: (userId, badgeId)
```

#### **notifications**
```
- id: UUID
- userId: UUID (foreign key → users)
- type: string (PROJECT_INVITE|SKILL_ENDORSEMENT|BADGE_EARNED|etc)
- title: string
- message: text
- isRead: boolean (default: false)
- data: JSON?
- createdAt: timestamp

Relations:
→ Belongs to: user
```

#### **join_requests** (Join table: projects ↔ users)
```
- id: UUID
- projectId: UUID (foreign key → projects)
- userId: UUID (foreign key → users)
- message: text?
- status: string (PENDING|ACCEPTED|REJECTED)
- createdAt: timestamp
- updatedAt: timestamp

Unique: (projectId, userId)
```

#### **certifications**
```
- id: UUID
- userId: UUID (foreign key → users)
- name: string
- issuer: string
- date: timestamp
- imageUrl: string?
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: user
```

#### **portfolios**
```
- id: UUID
- userId: UUID (foreign key → users)
- title: string
- link: string
- description: text?
- imageUrl: string?
- order: integer (default: 0)
- createdAt: timestamp
- updatedAt: timestamp

Relations:
→ Belongs to: user
```

#### **analytics**
```
- id: UUID
- userId: UUID (unique, foreign key → users)
- profileViews: integer (default: 0)
- projectInvites: integer (default: 0)
- ratingsAvg: float (default: 0.0)
- ratingsCount: integer (default: 0)
- lastViewedAt: timestamp?
- updatedAt: timestamp

Relations:
→ Belongs to: user (one-to-one)
```

#### **messages**
```
- id: UUID
- content: text
- senderId: UUID (foreign key → users)
- receiverId: UUID (foreign key → users)
- isRead: boolean (default: false)
- createdAt: timestamp

Relations:
→ Belongs to: sender (User), receiver (User)
```

---

## 2. Data Relationships

### User-Centric Relationships
```
User
├── UserSkills (many) → Skills
├── OwnedProjects (many)
├── ProjectMemberships (many) → Projects
├── Posts (many)
│   ├── Comments (many)
│   └── Likes (many)
├── Resources (many)
│   └── Ratings (many)
├── Certifications (many)
├── Portfolios (many)
├── UserBadges (many) → Badges
├── Notifications (many)
├── Analytics (one)
├── SentMessages (many)
└── ReceivedMessages (many)
```

### Project-Centric Relationships
```
Project
├── Owner (User)
├── Members (many) → Users
├── RequiredSkills (many) → Skills
├── Tasks (many)
│   └── Assignee (User)?
└── JoinRequests (many) → Users
```

### Resource-Centric Relationships
```
Resource
├── Uploader (User)
└── Ratings (many) → Users
```

### Post-Centric Relationships
```
Post
├── Author (User)
├── Comments (many)
│   └── Author (User)
└── Likes (many) → Users
```

---

## 3. Backend Services Summary

### 🔐 AuthService
**Purpose:** User authentication & account management

**Key Operations:**
- Register user → Returns user + token
- Login → Validates credentials, returns token
- Verify email → Marks account as verified
- Password reset flow → Token-based reset
- Profile CRUD → Get/update user profile

**Important Rules:**
- Email must be verified before login
- Passwords validated for strength
- Reset tokens expire after 1 hour
- Unique email and rollNumber enforced

---

### 👥 UserService
**Purpose:** User discovery & skill management

**Key Operations:**
- Search users → Filter by skills, department, year
- Get user profile → Public profile view
- Manage skills → Add/update/remove user skills
- Endorse skills → Increment endorsement count
- User statistics → Aggregate counts

**Important Rules:**
- Users can have each skill only once
- Endorsements unlimited (no duplicate check)
- Only verified users in search results

---

### 💡 SkillService
**Purpose:** Skills catalog management

**Key Operations:**
- List all skills → Grouped by category
- Search skills → By name/description
- CRUD operations → Create/update/delete skills
- Popular skills → Most used by users
- Skill stats → User count, endorsements

**Important Rules:**
- Skill names must be unique
- Cannot delete skills in use
- Categories are free-text

---

### 🚀 ProjectService
**Purpose:** Project management & collaboration

**Key Operations:**
- Create project → Auto-add owner as MAINTAINER
- Search projects → Filter by skills, status, type
- Join request system → Request → Accept/Reject flow
- Member management → Roles, join dates
- Task management → Create/update tasks

**Important Rules:**
- Only owner can update/delete project
- Owner automatically becomes MAINTAINER member
- maxMembers enforced on accept
- Assignees must be project members
- Prevent owner from joining own project

**Status Flow:** RECRUITING → ACTIVE → COMPLETED | CANCELLED
**Join Flow:** PENDING → ACCEPTED | REJECTED
**Roles:** MEMBER → COLLABORATOR → MAINTAINER

---

### 📚 ResourceService
**Purpose:** Study resources & file management

**Key Operations:**
- Upload resource → With file metadata
- Search resources → Filter by subject, semester, type
- Download tracking → Increment counter
- Rating system → 1-5 stars + review
- Resource stats → Downloads, avg rating

**Important Rules:**
- Only uploader can update/delete
- Users can rate once (can update rating)
- Download tracking is public (no auth)

**Resource Types:** PDF | DOC | VIDEO | LINK | CODE

---

### 💬 PostService
**Purpose:** Community discussions

**Key Operations:**
- Create posts → With type and tags
- Comment system → Nested comments
- Like toggle → Like/unlike posts
- Search posts → Filter by type, tags

**Important Rules:**
- Only author can update/delete post/comment
- Likes are toggleable (no duplicates)
- Comments ordered chronologically

**Post Types:** DISCUSSION | ANNOUNCEMENT | HELP | SHOWCASE

---

### 🏆 BadgeService
**Purpose:** Gamification & achievements

**Key Operations:**
- Get all badges → Available badges
- Check criteria → Auto-award badges
- Leaderboard → Top users by score

**Badge Categories:**
- SKILL: Based on skills, proficiency, endorsements
- CONTRIBUTION: Projects, resources, posts, comments
- ACHIEVEMENT: Downloads, likes, ratings received
- SPECIAL: First actions, verified status

**Important Rules:**
- Badges auto-awarded when criteria met
- Cannot lose badges once earned
- Criteria stored as JSON

---

### 🔔 NotificationService
**Purpose:** User notifications

**Key Operations:**
- Get notifications → Paginated, newest first
- Mark as read → Single or all
- Create notifications → Various types

**Notification Types:**
- PROJECT_INVITE
- SKILL_ENDORSEMENT
- BADGE_EARNED
- JOIN_REQUEST
- JOIN_REQUEST_RESPONSE
- RESOURCE_RATING
- COMMENT
- LIKE

**Important Rules:**
- Users only see their own notifications
- Contains optional JSON data for context

---

### 📜 CertificationService
**Purpose:** User certifications

**Key Operations:**
- Add certification → Name, issuer, date, image
- List certifications → Ordered by date
- CRUD operations → Owner only

---

### 🎨 PortfolioService
**Purpose:** User portfolio items

**Key Operations:**
- Add portfolio item → Title, link, description
- Reorder items → Custom order
- CRUD operations → Owner only

**Important Rules:**
- Order field controls display sequence
- Items can be reordered via array of IDs

---

### 📊 AnalyticsService
**Purpose:** User analytics & metrics

**Key Operations:**
- Track profile views → Auto-increment
- Track project invites → Count
- Calculate ratings → Running average
- Engagement score → Weighted formula

**Engagement Formula:**
```
Score = (profileViews × 0.1) + 
        (projectInvites × 2) + 
        (ratingsAvg × 5) + 
        (projectsCreated × 3) + 
        (postsCreated × 1) + 
        (skillsListed × 0.5)
```

---

## 4. API Endpoints Quick Reference

### Authentication (`/api/auth`)
```
POST   /register              - Register new user
POST   /login                 - Login user
GET    /verify-email/:token   - Verify email
POST   /forgot-password       - Request password reset
PUT    /reset-password/:token - Reset password
GET    /profile              🔒 Get current user profile
PUT    /profile              🔒 Update profile
PUT    /change-password      🔒 Change password
DELETE /account              🔒 Delete account
```

### Users (`/api/users`)
```
GET    /search                - Search users (paginated)
GET    /:userId               - Get user by ID
GET    /:userId/skills        - Get user skills
GET    /:userId/stats         - Get user statistics
POST   /skills               🔒 Add skill to profile
PUT    /skills/:skillId      🔒 Update skill
DELETE /skills/:skillId      🔒 Remove skill
POST   /:userId/skills/:skillId/endorse 🔒 Endorse skill
```

### Skills (`/api/skills`)
```
GET    /                      - Get all skills
GET    /category/:category    - Get skills by category
GET    /:id                   - Get skill by ID
GET    /search/:term          - Search skills
GET    /categories/list       - Get all categories
GET    /popular/:limit?       - Get popular skills
GET    /:id/stats             - Get skill statistics
GET    /:id/leaderboard/:limit? - Get skill leaderboard
POST   /                      - Create skill (admin)
PUT    /:id                   - Update skill (admin)
DELETE /:id                   - Delete skill (admin)
```

### Projects (`/api/projects`)
```
GET    /                      - Get all projects (paginated)
GET    /:id                   - Get project by ID
GET    /:id/members           - Get project members
POST   /                     🔒 Create project
PUT    /:id                  🔒 Update project (owner)
DELETE /:id                  🔒 Delete project (owner)
POST   /:id/join-request     🔒 Request to join
PUT    /:id/join-request/:requestId 🔒 Accept/reject (owner)
POST   /:id/tasks            🔒 Create task (members)
PUT    /:id/tasks/:taskId    🔒 Update task (members)
```

### Resources (`/api/resources`)
```
GET    /                      - Get all resources (paginated)
GET    /popular               - Get popular resources
GET    /:id                   - Get resource by ID
GET    /:id/ratings           - Get resource ratings
GET    /:id/stats             - Get resource statistics
POST   /:id/download          - Track download
POST   /                     🔒 Upload resource (multipart)
PUT    /:id                  🔒 Update resource (owner)
DELETE /:id                  🔒 Delete resource (owner)
POST   /:id/rating           🔒 Rate resource
```

### Posts (`/api/posts`)
```
GET    /                      - Get all posts (paginated)
GET    /:id                   - Get post by ID
POST   /                     🔒 Create post
PUT    /:id                  🔒 Update post (author)
DELETE /:id                  🔒 Delete post (author)
POST   /:id/comments         🔒 Add comment
PUT    /:id/comments/:commentId 🔒 Update comment (author)
DELETE /:id/comments/:commentId 🔒 Delete comment (author)
POST   /:id/like             🔒 Like/unlike post (toggle)
```

### Badges (`/api/badges`)
```
GET    /                      - Get all badges
GET    /:userId               - Get user badges
POST   /check                🔒 Check and award badges
GET    /leaderboard/:skillId? 🔒 Get leaderboard
```

### Notifications (`/api/notifications`)
```
GET    /                     🔒 Get notifications (paginated)
PUT    /:id/read             🔒 Mark as read
PUT    /read-all             🔒 Mark all as read
DELETE /:id                  🔒 Delete notification
```

### Certifications (`/api/certifications`)
```
POST   /                     🔒 Add certification
GET    /my                   🔒 Get my certifications
GET    /user/:userId          - Get user certifications
GET    /:id                  🔒 Get certification by ID
PUT    /:id                  🔒 Update certification (owner)
DELETE /:id                  🔒 Delete certification (owner)
```

### Portfolios (`/api/portfolios`)
```
POST   /                     🔒 Add portfolio item
GET    /my                   🔒 Get my portfolios
GET    /user/:userId          - Get user portfolios
PUT    /reorder              🔒 Reorder items
GET    /:id                  🔒 Get item by ID
PUT    /:id                  🔒 Update item (owner)
DELETE /:id                  🔒 Delete item (owner)
```

### Analytics (`/api/analytics`)
```
GET    /my                   🔒 Get my analytics
GET    /my/report            🔒 Get detailed report
GET    /my/engagement        🔒 Get engagement score
GET    /user/:userId          - Get user analytics (public)
```

🔒 = Requires authentication (JWT token)

---

## 5. Frontend Integration Checklist

### ✅ Setup & Configuration

- [ ] Install axios or fetch wrapper
- [ ] Install React Query or SWR for data fetching
- [ ] Setup authentication context/state
- [ ] Create API configuration with base URL
- [ ] Setup token storage (localStorage/cookies)
- [ ] Create axios interceptor for auth headers
- [ ] Setup error handling (toast notifications)

### ✅ Authentication Flow

- [ ] Login page with email/password
- [ ] Register page with all required fields
- [ ] Email verification page (token from URL)
- [ ] Forgot password page
- [ ] Reset password page (token from URL)
- [ ] Protected route wrapper/middleware
- [ ] Logout functionality
- [ ] Persist auth state across refreshes
- [ ] Redirect to login if unauthenticated
- [ ] Show "verify email" banner if not verified

### ✅ User Profile

- [ ] View user profile (public)
- [ ] Edit own profile
- [ ] Display user skills with proficiency badges
- [ ] Add/edit/remove skills
- [ ] Endorse other users' skills
- [ ] Display certifications
- [ ] Add/edit/delete certifications
- [ ] Display portfolio items
- [ ] Add/edit/delete/reorder portfolio
- [ ] Show user statistics
- [ ] Show analytics dashboard (own profile)

### ✅ Projects

- [ ] Browse projects (with filters: skills, status, type)
- [ ] View project details (members, tasks, required skills)
- [ ] Create new project
- [ ] Edit project (owner only)
- [ ] Delete project (owner only)
- [ ] Request to join project
- [ ] View join requests (owner)
- [ ] Accept/reject join requests (owner)
- [ ] Show maxMembers warning
- [ ] Display project members with roles
- [ ] Task board (TODO/IN_PROGRESS/COMPLETED)
- [ ] Create/edit tasks (members only)
- [ ] Assign tasks to members

### ✅ Resources

- [ ] Browse resources (with filters)
- [ ] View resource details
- [ ] Upload resource (with file)
- [ ] Edit resource (owner only)
- [ ] Delete resource (owner only)
- [ ] Download resource (track download)
- [ ] Rate resource (1-5 stars + review)
- [ ] Display average rating
- [ ] Show popular resources

### ✅ Community (Posts)

- [ ] Browse posts (with filters)
- [ ] View post details with comments
- [ ] Create post (with type and tags)
- [ ] Edit post (author only)
- [ ] Delete post (author only)
- [ ] Add comment
- [ ] Edit comment (author only)
- [ ] Delete comment (author only)
- [ ] Like/unlike post (toggle)
- [ ] Show like count

### ✅ Skills

- [ ] Browse all skills
- [ ] Filter by category
- [ ] Search skills
- [ ] View skill details
- [ ] Show popular skills
- [ ] Display skill leaderboard

### ✅ Badges

- [ ] Display earned badges
- [ ] Show all available badges
- [ ] Check for new badges button
- [ ] Display leaderboard
- [ ] Show badge criteria

### ✅ Notifications

- [ ] Notification bell icon with unread count
- [ ] Notification dropdown/page
- [ ] Mark notification as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Different icons for notification types
- [ ] Click to navigate to relevant content
- [ ] Real-time updates (polling or WebSocket)

### ✅ Search & Discovery

- [ ] Search users by name, skills, department
- [ ] Search projects by skills, status
- [ ] Search resources by subject, type
- [ ] Search posts by tags, type
- [ ] Search skills by name

### ✅ UI/UX Features

- [ ] Loading skeletons for all lists
- [ ] Error messages with retry buttons
- [ ] Success toast notifications
- [ ] Pagination for all lists
- [ ] Infinite scroll (optional)
- [ ] Empty states with helpful messages
- [ ] Form validation matching backend rules
- [ ] Optimistic updates where appropriate
- [ ] Responsive design (mobile-first)
- [ ] Dark mode (optional)

### ✅ Authorization UI

- [ ] Hide edit/delete buttons if not owner
- [ ] Disable join button if already member
- [ ] Show different UI for project owner vs member
- [ ] Hide features for unverified users
- [ ] Show role badges (MAINTAINER, COLLABORATOR, MEMBER)

### ✅ Data Display

- [ ] Format dates (relative time or formatted)
- [ ] Show user avatars with fallback initials
- [ ] Display proficiency levels with badges/colors
- [ ] Show status badges (project status, task status)
- [ ] Display tags as chips
- [ ] Show download/view counts
- [ ] Display ratings as stars

---

## Key Integration Points

### 1. Authentication Flow
```typescript
// Login flow
1. User enters email/password
2. Call POST /api/auth/login
3. Receive { user, token }
4. Store token in localStorage
5. Set auth context/state
6. Redirect to dashboard

// Protected route check
1. Check if token exists
2. If not, redirect to /login
3. If yes, verify with GET /api/auth/profile
4. If valid, render page
5. If invalid, clear token and redirect to /login
```

### 2. Ownership Checks
```typescript
// Example: Project page
const project = await getProject(id);
const currentUser = useAuth();

const isOwner = project.ownerId === currentUser.id;
const isMember = project.members.some(m => m.userId === currentUser.id);

// Show edit/delete only if owner
{isOwner && <Button>Edit Project</Button>}

// Show task creation if member or owner
{(isMember || isOwner) && <Button>Create Task</Button>}
```

### 3. Pagination
```typescript
// Standard pagination pattern
const { data, pagination } = await getProjects({
  page: currentPage,
  limit: 20,
  // other filters
});

// Display data
data.forEach(project => ...)

// Show pagination controls
if (pagination.hasPrev) <Button onClick={() => setPage(page - 1)} />
if (pagination.hasNext) <Button onClick={() => setPage(page + 1)} />
```

### 4. Error Handling
```typescript
try {
  await api.createProject(projectData);
  toast.success('Project created!');
  router.push('/projects');
} catch (error) {
  if (error.message.includes('maxMembers')) {
    toast.error('Project is full');
  } else if (error.message.includes('Already a member')) {
    toast.error('You are already a member');
  } else {
    toast.error('Failed to create project');
  }
}
```

### 5. Real-time Features
```typescript
// Poll notifications every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    refetch(); // React Query refetch
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

---

## Important Notes

1. **All string enums are UPPERCASE:** BEGINNER, TODO, PENDING, etc.
2. **Dates are ISO 8601 strings:** Use Date objects or format libraries
3. **File uploads use multipart/form-data:** Not JSON
4. **Pagination is always present** for list endpoints
5. **JWT tokens must be refreshed** (implement token refresh logic)
6. **Profile views auto-increment** when viewing user profiles
7. **Likes are toggleable** - clicking twice unlikes
8. **Join requests can't be duplicated** - check status first
9. **Endorsements are unlimited** - no duplicate check
10. **Badge checking is manual** - user must click "Check badges"

---

## Testing Checklist

- [ ] Test all CRUD operations
- [ ] Test ownership restrictions
- [ ] Test pagination on all lists
- [ ] Test search with various filters
- [ ] Test file upload (resources)
- [ ] Test like toggle behavior
- [ ] Test join request flow end-to-end
- [ ] Test notification creation and marking read
- [ ] Test badge award criteria
- [ ] Test protected routes (redirect when not logged in)
- [ ] Test email verification flow
- [ ] Test password reset flow
- [ ] Test form validations match backend
- [ ] Test error handling for all failure cases

---

This document provides complete understanding of the KolabIT backend structure, services, and integration requirements. Use it as your single source of truth when building frontend features.