# KolabIT Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Authentication

Most endpoints require authentication using JWT tokens.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

# API Endpoints

## 🔐 Authentication (`/api/auth`)

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "rollNumber": "SPIT001",
  "department": "Computer Engineering",
  "year": 3,
  "semester": 5,
  "bio": "Passionate developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm1a2b3c4",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false,
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully. Please check your email for verification."
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### POST `/auth/login`
Login to existing account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### GET `/auth/verify-email/:token`
Verify user email address.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

---

### POST `/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Rate Limit:** 3 requests per hour

---

### PUT `/auth/reset-password/:token`
Reset password using token from email.

**Request Body:**
```json
{
  "password": "NewSecurePass123"
}
```

**Rate Limit:** 3 requests per hour

---

### GET `/auth/profile` 🔒
Get current user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cm1a2b3c4",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "rollNumber": "SPIT001",
    "department": "Computer Engineering",
    "year": 3,
    "semester": 5,
    "bio": "Passionate developer",
    "avatar": "https://example.com/avatar.jpg",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### PUT `/auth/profile` 🔒
Update current user's profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "department": "Computer Engineering",
  "year": 3,
  "semester": 5,
  "avatar": "https://example.com/new-avatar.jpg"
}
```

---

### PUT `/auth/change-password` 🔒
Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

---

### DELETE `/auth/account` 🔒
Delete user account permanently.

---

## 👥 Users (`/api/users`)

### GET `/users/search`
Search for users with filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)
- `search` (string): Search term for name/email
- `skills` (string): Comma-separated skill IDs
- `department` (string): Filter by department
- `year` (number): Filter by academic year
- `sortBy` (string): Sort field (default: "createdAt")
- `sortOrder` (string): "asc" or "desc" (default: "desc")

**Example:** `/users/search?search=john&skills=skill1,skill2&department=Computer&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "cm1a2b3c4",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "department": "Computer Engineering",
        "year": 3,
        "avatar": "https://...",
        "skills": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Rate Limit:** 30 requests per minute

---

### GET `/users/:userId`
Get user profile by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cm1a2b3c4",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "rollNumber": "SPIT001",
    "department": "Computer Engineering",
    "year": 3,
    "semester": 5,
    "bio": "Passionate developer",
    "avatar": "https://...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET `/users/:userId/skills`
Get all skills of a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "skill1",
      "userId": "cm1a2b3c4",
      "skill": {
        "id": "skill1",
        "name": "React",
        "category": "Frontend",
        "icon": "⚛️"
      },
      "proficiency": "Advanced",
      "yearsOfExp": 2,
      "endorsements": 15
    }
  ]
}
```

---

### POST `/users/skills` 🔒
Add skill to current user's profile.

**Request Body:**
```json
{
  "skillId": "skill1",
  "proficiency": "Advanced",
  "yearsOfExp": 2
}
```

---

### PUT `/users/skills/:skillId` 🔒
Update user's skill.

**Request Body:**
```json
{
  "proficiency": "Expert",
  "yearsOfExp": 3
}
```

---

### DELETE `/users/skills/:skillId` 🔒
Remove skill from user's profile.

---

### POST `/users/:userId/skills/:skillId/endorse` 🔒
Endorse a user's skill.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Skill endorsed successfully",
    "endorsements": 16
  }
}
```

---

### GET `/users/:userId/stats`
Get user statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "projectCount": 5,
    "skillCount": 12,
    "badgeCount": 8,
    "endorsementCount": 45,
    "resourceCount": 3,
    "postCount": 10
  }
}
```

---

### GET `/users/:skillId/users`
Get all users with a specific skill.

**Rate Limit:** 30 requests per minute

---

## 🚀 Projects (`/api/projects`)

### GET `/projects`
Get all projects with filters.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Results per page
- `search` (string): Search term
- `skills` (string): Comma-separated skill IDs
- `status` (string): Project status (active, completed, recruiting)
- `type` (string): Project type
- `sortBy` (string): Sort field
- `sortOrder` (string): "asc" or "desc"

**Example:** `/projects?status=active&skills=skill1,skill2&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj1",
        "title": "E-Commerce Platform",
        "description": "Full-stack e-commerce solution",
        "status": "active",
        "type": "Web Development",
        "maxMembers": 5,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-06-01T00:00:00Z",
        "githubUrl": "https://github.com/...",
        "liveUrl": "https://demo.example.com",
        "owner": {
          "id": "user1",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://..."
        },
        "members": [...],
        "requiredSkills": [
          {
            "skill": {
              "name": "React",
              "category": "Frontend"
            },
            "required": true
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Rate Limit:** 30 requests per minute

---

### GET `/projects/:id`
Get project details by ID.

---

### POST `/projects` 🔒
Create a new project.

**Request Body:**
```json
{
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce solution with React and Node.js",
  "status": "recruiting",
  "type": "Web Development",
  "maxMembers": 5,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-06-01T00:00:00Z",
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://demo.example.com",
  "requiredSkills": [
    {
      "skillId": "skill1",
      "required": true
    },
    {
      "skillId": "skill2",
      "required": false
    }
  ]
}
```

---

### PUT `/projects/:id` 🔒
Update project (owner only).

**Request Body:** Same as create, all fields optional

---

### DELETE `/projects/:id` 🔒
Delete project (owner only).

---

### POST `/projects/:id/join-request` 🔒
Request to join a project.

**Request Body:**
```json
{
  "message": "I have 2 years of React experience and would love to contribute!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req1",
    "projectId": "proj1",
    "userId": "user1",
    "message": "I have 2 years...",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Join request sent successfully"
}
```

---

### PUT `/projects/:id/join-request/:requestId` 🔒
Accept or reject join request (owner only).

**Request Body:**
```json
{
  "status": "accepted"
}
```

---

### GET `/projects/:id/members`
Get all members of a project.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member1",
      "user": {
        "id": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://..."
      },
      "role": "Frontend Developer",
      "joinedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST `/projects/:id/tasks` 🔒
Create a task (project member only).

**Request Body:**
```json
{
  "title": "Design landing page",
  "description": "Create responsive landing page with hero section",
  "status": "todo",
  "priority": "high",
  "assigneeId": "user1",
  "dueDate": "2024-02-01T00:00:00Z"
}
```

---

### PUT `/projects/:id/tasks/:taskId` 🔒
Update a task (project member only).

**Request Body:**
```json
{
  "status": "in_progress",
  "priority": "medium"
}
```

---

## 📚 Resources (`/api/resources`)

### GET `/resources`
Get all resources with filters.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Results per page
- `search` (string): Search term
- `subject` (string): Filter by subject
- `type` (string): Filter by type (notes, assignment, book, etc.)
- `semester` (number): Filter by semester
- `sortBy` (string): Sort field
- `sortOrder` (string): "asc" or "desc"

**Example:** `/resources?subject=Mathematics&semester=3&type=notes&page=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "res1",
        "title": "Data Structures Notes",
        "description": "Complete notes with examples",
        "type": "notes",
        "subject": "Computer Science",
        "semester": 3,
        "fileUrl": "/uploads/file.pdf",
        "fileName": "ds_notes.pdf",
        "fileSize": 1048576,
        "downloads": 150,
        "uploader": {
          "id": "user1",
          "firstName": "John",
          "lastName": "Doe"
        },
        "ratings": {
          "average": 4.5,
          "count": 20
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

**Rate Limit:** 30 requests per minute

---

### GET `/resources/popular`
Get most downloaded resources.

**Query Parameters:**
- `limit` (number): Number of results (default: 10)

---

### GET `/resources/:id`
Get resource details by ID.

---

### POST `/resources` 🔒
Upload a new resource.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (string): Resource title
- `description` (string): Resource description
- `type` (string): Resource type
- `subject` (string): Subject name
- `semester` (number): Semester number
- `file` (file): The resource file

**Rate Limit:** 20 uploads per hour

---

### PUT `/resources/:id` 🔒
Update resource (uploader only).

---

### DELETE `/resources/:id` 🔒
Delete resource (uploader only).

---

### POST `/resources/:id/download`
Track a resource download.

**Response:**
```json
{
  "success": true,
  "data": {
    "downloads": 151
  }
}
```

---

### POST `/resources/:id/rating` 🔒
Rate a resource.

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent notes, very helpful!"
}
```

---

### GET `/resources/:id/ratings`
Get all ratings for a resource.

---

### GET `/resources/:id/stats`
Get resource statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "downloads": 150,
    "averageRating": 4.5,
    "ratingCount": 20,
    "viewCount": 300
  }
}
```

---

## 💬 Posts & Community (`/api/posts`)

### GET `/posts`
Get all posts with filters.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Results per page
- `search` (string): Search term
- `type` (string): Post type (question, discussion, announcement, etc.)
- `tags` (string): Comma-separated tags
- `sortBy` (string): Sort field
- `sortOrder` (string): "asc" or "desc"

**Example:** `/posts?type=question&tags=react,javascript&page=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post1",
        "title": "How to optimize React performance?",
        "content": "I'm working on a large React app and facing performance issues...",
        "type": "question",
        "tags": ["react", "performance", "optimization"],
        "author": {
          "id": "user1",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://..."
        },
        "likes": [
          { "userId": "user2" }
        ],
        "comments": [
          {
            "id": "comment1",
            "content": "Try using React.memo...",
            "author": {...},
            "createdAt": "2024-01-15T11:00:00Z"
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "pages": 10
    }
  }
}
```

**Rate Limit:** 30 requests per minute

---

### GET `/posts/:id`
Get post details by ID.

---

### POST `/posts` 🔒
Create a new post.

**Request Body:**
```json
{
  "title": "How to optimize React performance?",
  "content": "I'm working on a large React app...",
  "type": "question",
  "tags": ["react", "performance"]
}
```

---

### PUT `/posts/:id` 🔒
Update post (author only).

---

### DELETE `/posts/:id` 🔒
Delete post (author only).

---

### POST `/posts/:id/comments` 🔒
Add a comment to a post.

**Request Body:**
```json
{
  "content": "Try using React.memo for expensive components"
}
```

---

### PUT `/posts/:id/comments/:commentId` 🔒
Update a comment (author only).

---

### DELETE `/posts/:id/comments/:commentId` 🔒
Delete a comment (author only).

---

### POST `/posts/:id/like` 🔒
Like or unlike a post (toggle).

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 25
  }
}
```

---

## 💡 Skills (`/api/skills`)

### GET `/skills`
Get all available skills.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "skill1",
      "name": "React",
      "category": "Frontend",
      "description": "JavaScript library for building UIs",
      "icon": "⚛️",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/skills/category/:category`
Get skills by category.

---

### GET `/skills/:id`
Get skill details by ID.

---

### GET `/skills/search/:term`
Search skills by name.

**Query Parameters:**
- `category` (string): Filter by category

**Rate Limit:** 30 requests per minute

---

### GET `/skills/categories/list`
Get all skill categories.

**Response:**
```json
{
  "success": true,
  "data": [
    "Frontend",
    "Backend",
    "DevOps",
    "Mobile",
    "Data Science",
    "Design"
  ]
}
```

---

### GET `/skills/popular/:limit?`
Get most popular skills.

---

### GET `/skills/:id/stats`
Get skill statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "userCount": 150,
    "projectCount": 45,
    "averageProficiency": "Intermediate",
    "totalEndorsements": 500
  }
}
```

---

### GET `/skills/:id/leaderboard/:limit?`
Get top users for a specific skill.

---

## 🏆 Badges (`/api/badges`)

### GET `/badges`
Get all available badges.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "badge1",
      "name": "First Project",
      "description": "Created your first project",
      "icon": "🎯",
      "category": "Projects",
      "criteria": "Create 1 project"
    }
  ]
}
```

---

### GET `/badges/:userId`
Get badges earned by a user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ub1",
      "badge": {
        "id": "badge1",
        "name": "First Project",
        "icon": "🎯"
      },
      "earnedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST `/badges/check` 🔒
Check and award eligible badges to current user.

---

### GET `/badges/leaderboard/:skillId?` 🔒
Get badge leaderboard.

**Query Parameters:**
- `limit` (number): Number of results (default: 10)

---

## 🔔 Notifications (`/api/notifications`)

All notification routes require authentication.

### GET `/notifications` 🔒
Get user notifications.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif1",
        "type": "project_invite",
        "title": "Project Invitation",
        "message": "John Doe invited you to join 'E-Commerce Platform'",
        "isRead": false,
        "data": {
          "projectId": "proj1",
          "inviterId": "user1"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

### PUT `/notifications/:id/read` 🔒
Mark notification as read.

---

### PUT `/notifications/read-all` 🔒
Mark all notifications as read.

---

### DELETE `/notifications/:id` 🔒
Delete a notification.

---

## 📜 Certifications (`/api/certifications`)

### POST `/certifications` 🔒
Add a new certification.

**Request Body:**
```json
{
  "name": "AWS Solutions Architect",
  "issuer": "Amazon Web Services",
  "date": "2024-01-15T00:00:00Z",
  "imageUrl": "https://example.com/cert.jpg"
}
```

---

### GET `/certifications/my` 🔒
Get current user's certifications.

---

### GET `/certifications/user/:userId`
Get certifications of a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cert1",
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2024-01-15T00:00:00Z",
      "imageUrl": "https://...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET `/certifications/:id` 🔒
Get certification by ID.

---

### PUT `/certifications/:id` 🔒
Update certification (owner only).

---

### DELETE `/certifications/:id` 🔒
Delete certification (owner only).

---

## 🎨 Portfolio (`/api/portfolios`)

### POST `/portfolios` 🔒
Add a new portfolio item.

**Request Body:**
```json
{
  "title": "E-Commerce Website",
  "link": "https://myproject.com",
  "description": "Full-stack e-commerce platform built with MERN stack",
  "imageUrl": "https://example.com/screenshot.jpg",
  "order": 0
}
```

---

### GET `/portfolios/my` 🔒
Get current user's portfolio items.

---

### GET `/portfolios/user/:userId`
Get portfolio items of a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "port1",
      "title": "E-Commerce Website",
      "link": "https://myproject.com",
      "description": "Full-stack e-commerce platform...",
      "imageUrl": "https://...",
      "order": 0,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET `/portfolios/:id` 🔒
Get portfolio item by ID.

---

### PUT `/portfolios/:id` 🔒
Update portfolio item (owner only).

---

### DELETE `/portfolios/:id` 🔒
Delete portfolio item (owner only).

---

### PUT `/portfolios/reorder` 🔒
Reorder portfolio items.

**Request Body:**
```json
{
  "itemIds": ["port3", "port1", "port2"]
}
```

---

## 📊 Analytics (`/api/analytics`)

### GET `/analytics/my` 🔒
Get current user's analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analytics1",
    "profileViews": 150,
    "projectInvites": 5,
    "ratingsAvg": 4.5,
    "ratingsCount": 20,
    "lastViewedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET `/analytics/my/report` 🔒
Get detailed analytics report for current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "profileViews": 150,
      "projectInvites": 5,
      "skillEndorsements": 45
    },
    "activity": {
      "projectsCreated": 3,
      "projectsJoined": 5,
      "resourcesUploaded": 10,
      "postsCreated": 15
    },
    "engagement": {
      "commentsReceived": 50,
      "likesReceived": 100,
      "endorsementsGiven": 30
    }
  }
}
```

---

### GET `/analytics/my/engagement` 🔒
Get engagement score for current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "level": "Active",
    "breakdown": {
      "projects": 25,
      "resources": 20,
      "community": 20,
      "skills": 20
    }
  }
}
```

---

### GET `/analytics/user/:userId`
Get public analytics for a user.

---

## 🔒 Authentication Note

Routes marked with 🔒 require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limits

- **Auth endpoints:** 5 requests per 15 minutes
- **Password reset:** 3 requests per hour
- **File uploads:** 20 uploads per hour
- **Search endpoints:** 30 requests per minute
- **General API:** Varies by configuration

## Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Duplicate resource
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error


I'm building KolabIT - a college collaboration platform. I have a complete Express.js + Prisma backend and need you to build a production-ready Next.js 14+ frontend. 

PLATFORM FEATURES: - User profiles with skills, badges, certifications, portfolio
 - Project discovery & collaboration (create, join, manage tasks) 
- Resource library (upload/download study materials with ratings) 
- Community forum (posts, comments, likes) - Real-time notifications 
- Analytics dashboard 
- Gamification (badges, leaderboards) 
TECH STACK REQUIRED:
 - Next.js 14+ with App Router 
- TypeScript (strict mode) 
- Tailwind CSS for styling 
- React Query or SWR for data fetching 
- Zustand or Context API for state management 
- react-hook-form + zod for forms
- shadcn/ui components

AUTHENTICATION: - JWT tokens stored in localStorage - Protected routes with middleware - Login/Register pages - Password reset flow 

FILES I'M PROVIDING: 1. Complete API documentation (all endpoints, request/response formats) 2. TypeScript types matching the backend 3. Ready-to-use API functions with authentication

REQUIREMENTS: ✅ Fully responsive design (mobile-first) ✅ Loading states with skeletons ✅ Error handling with toast notifications ✅ Optimistic updates where appropriate ✅ Pagination for all lists ✅ Search and filter functionality ✅ File upload support (resources, avatars) ✅ Protected routes (redirect to login if not authenticated) ✅ Clean, modern UI with good UX

KEY PAGES NEEDED: - / (Landing page - public) - /login, /register (Auth pages) - /dashboard (User dashboard) - /profile/[userId] (User profile - public) - /projects (Browse projects) - /projects/[id] (Project details) - /projects/create (Create project - protected) - /resources (Browse resources) - /resources/upload (Upload resource - protected) - /community (Forum/posts) - /community/[postId] (Post details) - /notifications (User notifications - protected)

Please build a clean, functional, production-ready application that connects seamlessly with my backend API.

THE ZIP CONTAINS UI FILES, 


