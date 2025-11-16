# Backend API Endpoints Required

This document lists all the backend API endpoints that need to be implemented to support the new project management features.

## Current Status
- ✅ Frontend implemented with all 9 features
- ✅ Database schema supports all features (join_requests table exists)
- ❌ Backend API routes NOT implemented
- ⚠️ Frontend has graceful error handling for missing endpoints

## Required Endpoints

### 1. Get Join Requests for Project
**Route:** `GET /api/projects/:projectId/join-requests`  
**Auth:** Required (project owner only)  
**Description:** Get all join requests for a specific project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request-uuid",
      "userId": "user-uuid",
      "projectId": "project-uuid",
      "message": "I would love to join...",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "skills": [
          { "id": "skill-uuid", "name": "React", "level": "expert" }
        ]
      }
    }
  ]
}
```

**Database Query:**
```sql
SELECT jr.*, 
       json_build_object(
         'id', u.id,
         'firstName', u.first_name,
         'lastName', u.last_name,
         'email', u.email
       ) as user
FROM join_requests jr
JOIN users u ON jr.user_id = u.id
WHERE jr.project_id = $1
ORDER BY jr.created_at DESC
```

---

### 2. Get User's Join Requests
**Route:** `GET /api/projects/my-join-requests`  
**Auth:** Required  
**Description:** Get all join requests submitted by the current user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request-uuid",
      "userId": "user-uuid",
      "projectId": "project-uuid",
      "message": "I would love to join...",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "project": {
        "id": "project-uuid",
        "title": "AI Chatbot",
        "description": "Building an AI-powered chatbot..."
      }
    }
  ]
}
```

**Database Query:**
```sql
SELECT jr.*, 
       json_build_object(
         'id', p.id,
         'title', p.title,
         'description', p.description
       ) as project
FROM join_requests jr
JOIN projects p ON jr.project_id = p.id
WHERE jr.user_id = $1
ORDER BY jr.created_at DESC
```

---

### 3. Update Join Request Status
**Route:** `PUT /api/projects/:projectId/join-requests/:requestId`  
**Auth:** Required (project owner only)  
**Description:** Approve or reject a join request

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Join request approved",
  "data": {
    "id": "request-uuid",
    "status": "approved"
  }
}
```

**Actions to Perform:**
1. Update join request status
2. If approved: Add user to project members
3. Send notification to user
4. Return updated request

**Database Queries:**
```sql
-- Update request status
UPDATE join_requests 
SET status = $1, updated_at = NOW()
WHERE id = $2 AND project_id = $3

-- If approved, add to project members
INSERT INTO project_members (project_id, user_id, role)
VALUES ($1, $2, 'member')
ON CONFLICT DO NOTHING

-- Create notification
INSERT INTO notifications (user_id, type, title, message)
VALUES ($1, 'join_request_approved', 'Join Request Approved', 'Your request to join {project_title} has been approved!')
```

---

### 4. Link Resource to Project
**Route:** `POST /api/projects/:projectId/resources`  
**Auth:** Required (project member or owner)  
**Description:** Link an existing resource to a project

**Request Body:**
```json
{
  "resourceId": "resource-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resource linked to project",
  "data": {
    "projectId": "project-uuid",
    "resourceId": "resource-uuid"
  }
}
```

**Database Query:**
```sql
INSERT INTO project_resources (project_id, resource_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING
RETURNING *
```

---

### 5. Unlink Resource from Project
**Route:** `DELETE /api/projects/:projectId/resources/:resourceId`  
**Auth:** Required (project member or owner)  
**Description:** Remove a resource link from a project

**Response:**
```json
{
  "success": true,
  "message": "Resource unlinked from project"
}
```

**Database Query:**
```sql
DELETE FROM project_resources
WHERE project_id = $1 AND resource_id = $2
```

---

### 6. Get Project Resources
**Route:** `GET /api/projects/:projectId/resources`  
**Auth:** Required  
**Description:** Get all resources linked to a project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "resource-uuid",
      "title": "React Documentation",
      "type": "documentation",
      "url": "https://react.dev",
      "subject": "Web Development",
      "linkedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Database Query:**
```sql
SELECT r.*, pr.created_at as linked_at
FROM resources r
JOIN project_resources pr ON r.id = pr.resource_id
WHERE pr.project_id = $1
ORDER BY pr.created_at DESC
```

---

### 7. Get User Skills
**Route:** `GET /api/users/:userId/skills`  
**Auth:** Required  
**Description:** Get all skills for a specific user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "skill-uuid",
      "userId": "user-uuid",
      "name": "React",
      "level": "expert",
      "verified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Database Query:**
```sql
SELECT * FROM user_skills
WHERE user_id = $1
ORDER BY level DESC, name ASC
```

---

## Database Schema Requirements

### join_requests Table (Already Exists ✅)
```sql
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);
```

### project_resources Table (Needs Creation ❌)
```sql
CREATE TABLE IF NOT EXISTS project_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, resource_id)
);
```

### user_skills Table (Verify Exists)
```sql
-- If doesn't exist, create:
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```

---

## Implementation Priority

### High Priority (Blocking Features)
1. **Get Join Requests for Project** - Needed for /projects/my-requests page
2. **Get User's Join Requests** - Needed for user dashboard
3. **Update Join Request Status** - Needed for approve/reject functionality

### Medium Priority (Enhanced Features)
4. **Get User Skills** - Needed for skill matching display
5. **Get Project Resources** - Needed for resources tab

### Low Priority (Nice to Have)
6. **Link Resource to Project** - Already has frontend integration
7. **Unlink Resource from Project** - Management feature

---

## Testing Checklist

After implementing each endpoint:

- [ ] Test with Postman/curl
- [ ] Verify authentication works
- [ ] Test with valid data
- [ ] Test with invalid data (error handling)
- [ ] Test authorization (only owner can approve requests)
- [ ] Check database records are created/updated correctly
- [ ] Verify notifications are sent (for join requests)
- [ ] Test with frontend integration

---

## Frontend Integration Status

All frontend code is ready and has graceful error handling:
- ✅ Calls wrapped in try-catch blocks
- ✅ Toast notifications for user feedback
- ✅ Silent failures when endpoints not available (console.warn instead of console.error)
- ✅ UI degrades gracefully (empty states shown)

Once backend endpoints are implemented, no frontend changes needed - features will work automatically!

---

## Quick Start for Backend Developer

1. Create route files in `src/routes/`:
   - `joinRequests.ts` (for join request endpoints)
   - `projectResources.ts` (for resource linking)
   - Update `users.ts` (add getUserSkills)

2. Create controller functions in `src/controllers/`

3. Add authentication middleware to protect routes

4. Test each endpoint individually

5. Update frontend if API response format differs from expected

---

## Error Handling Guidelines

All endpoints should return consistent error format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad request (invalid data)
- 401: Unauthorized (not logged in)
- 403: Forbidden (not project owner)
- 404: Not found
- 500: Server error
