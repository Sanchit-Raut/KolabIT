# PROJECT MANAGEMENT FEATURES - QUICK REFERENCE

## 🎯 User Journey Map

### For Project Seekers (Students looking to join projects):

1. **Browse Projects** (`/projects`)
   - View all available projects
   - Filter by status, type, skills
   - See member count and recruitment status

2. **View Project Details** (`/projects/[id]`)
   - See skill matching score
   - Read project description and requirements
   - View current team members
   - Check project resources

3. **Request to Join**
   - Click "Request to Join" button
   - Write optional message (max 500 chars)
   - Submit request
   - Wait for owner's response

4. **Check Request Status**
   - Button shows "Request Pending" if waiting
   - Receive notification when approved/rejected

---

### For Project Owners:

1. **Create Project** (`/projects/create`)
   - Fill in project details
   - Set max members
   - Select required skills
   - Publish project

2. **Manage Join Requests** (`/projects/my-requests`)
   - View all incoming requests
   - See applicant's skill match
   - Read their message
   - Approve or reject
   - Chat with applicants

3. **Edit Project** (`/projects/[id]`)
   - Click "Edit" button (owner only)
   - Update any project details
   - Change status (RECRUITING, ACTIVE, CLOSED, etc.)
   - Modify required skills
   - Save changes

4. **Link Resources** (`/resources`)
   - Browse available resources
   - Click three-dot menu on any resource
   - Select "Add to Project"
   - Choose which project to link to

5. **View Team** (`/projects/[id]` - Team Tab)
   - See all team members
   - View roles and join dates
   - Check if project is at capacity

---

## 🔑 Key Features by User Type

### Anonymous Users:
✅ Browse projects  
✅ View project details  
✅ See team members  
✅ View linked resources  
❌ Cannot join projects  
❌ Cannot see skill matching  

### Authenticated Non-Members:
✅ Everything anonymous users can do  
✅ See skill matching display  
✅ Send join requests  
✅ Link resources to own projects  
❌ Cannot manage join requests (not owner)  
❌ Cannot edit projects (not owner)  

### Project Members:
✅ Everything authenticated users can do  
✅ Access project resources  
✅ See full team information  
❌ Cannot send join request (already member)  
❌ Cannot edit project (not owner)  

### Project Owners:
✅ Everything members can do  
✅ Edit project details  
✅ Manage join requests (approve/reject)  
✅ Link/unlink resources  
✅ Close project manually  
✅ Change project status  

---

## 📍 Page Locations

| Feature | URL | Access |
|---------|-----|--------|
| Project List | `/projects` | Everyone |
| Project Details | `/projects/[id]` | Everyone |
| Create Project | `/projects/create` | Authenticated |
| Join Requests | `/projects/my-requests` | Project Owners |
| Resources | `/resources` | Everyone |
| Resource Details | `/resources/[id]` | Everyone |

---

## 🎨 Visual Indicators

### Badge Colors:

**Project Status:**
- 🟢 Green: RECRUITING
- 🔵 Blue: ACTIVE / IN PROGRESS
- 🟣 Purple: COMPLETED
- 🟡 Yellow: PLANNING
- ⚫ Gray: CLOSED / CANCELLED

**Member Roles:**
- 🔵 Blue: MAINTAINER
- 🟣 Purple: COLLABORATOR
- ⚫ Gray: MEMBER

**Skill Matching:**
- 🟢 Green with ✓: Matched skills
- ⚪ Outline with ✗: Skills needed

**Join Request Status:**
- 🟡 Yellow with ⏱: PENDING
- 🟢 Green with ✓: ACCEPTED
- 🔴 Red with ✗: REJECTED

---

## ⚡ Quick Actions

### Project Details Page:
```
🔙 Back to Projects
📝 Edit (Owner only)
💬 Message Lead
👥 Manage Join Requests (Owner only)
📤 Request to Join (Non-members)
```

### Resource Cards:
```
👁️ View Details
⋮ Add to Project (Dropdown menu)
```

### Join Request Cards:
```
💬 Chat with applicant
✓ Approve request
✗ Reject request
```

---

## 🔔 Notification Types

1. **JOIN_REQUEST**
   - Sent to: Project Owner
   - Message: "{userName} wants to join {projectTitle}"
   - Trigger: User sends join request

2. **REQUEST_ACCEPTED**
   - Sent to: Applicant
   - Message: "Your request to join {projectTitle} has been accepted"
   - Trigger: Owner approves request

3. **REQUEST_REJECTED**
   - Sent to: Applicant
   - Message: "Your request to join {projectTitle} was not accepted"
   - Trigger: Owner rejects request

4. **PROJECT_FULL**
   - Sent to: Project Owner
   - Message: "Project {projectTitle} is now full and has been closed"
   - Trigger: Last spot filled (auto-close)

---

## 🛡️ Validation Rules

### Join Requests:
- ❌ Cannot request if already owner
- ❌ Cannot request if already member
- ❌ Cannot request if already pending
- ❌ Cannot request if project full
- ❌ Cannot request if project closed
- ✅ Message max 500 characters

### Project Edit:
- ❌ Max members cannot be less than current member count
- ✅ All fields optional except title and description
- ✅ Can change status to CLOSED anytime
- ✅ Required skills are multi-select

### Resource Linking:
- ❌ Only authenticated users can link
- ❌ Only to projects they own
- ✅ Can link same resource to multiple projects

---

## 🐛 Common Issues & Solutions

### Issue: "Request to Join" button not showing
**Solution:** Check if:
- User is logged in
- User is not already owner or member
- Project is not full (check member count vs maxMembers)
- Project status is not CLOSED or CANCELLED
- User hasn't already sent a pending request

### Issue: Skill matching not showing
**Solution:** Check if:
- User is logged in
- User has skills in their profile
- Project has required skills defined
- Skills are properly loaded from API

### Issue: Cannot approve join request
**Solution:** Check if:
- User is the project owner
- Request status is PENDING
- Backend endpoint is working
- Project has space available

### Issue: Resources not appearing in project
**Solution:** Check if:
- Resources are properly linked via API
- Project resources endpoint is working
- Resource linking was successful
- Page has been refreshed after linking

---

## 📊 Status Flow Diagrams

### Join Request Flow:
```
User Sends Request
        ↓
Status: PENDING
        ↓
    ┌───┴───┐
    ↓       ↓
APPROVED  REJECTED
    ↓       ↓
Added to   Status Updated
 Team      Notification Sent
```

### Project Status Flow:
```
PLANNING → RECRUITING → ACTIVE → COMPLETED
                ↓
              CLOSED (manual or auto)
                ↓
            CANCELLED (optional)
```

### Auto-Close Flow:
```
Owner Approves Request
        ↓
Backend Adds Member
        ↓
Check: members.length >= maxMembers?
        ↓
    ┌───┴───┐
   YES      NO
    ↓        ↓
Set CLOSED  Keep Current Status
    ↓
Send Notification
```

---

## 🔗 Related Documentation

- Main Implementation: `PROJECT_MANAGEMENT_IMPLEMENTATION.md`
- API Documentation: `/info-kolabit/api_documentation.md`
- TypeScript Types: `/Frontend/lib/types.ts`
- Database Schema: `/prisma/schema.prisma`

---

## 💡 Tips for Developers

1. **Always check user authentication before showing features**
2. **Use type assertions (`as any`) for API responses with flexible structure**
3. **Handle loading and error states for all async operations**
4. **Prevent event propagation when nesting clickable elements**
5. **Use toast notifications for user feedback on all actions**
6. **Validate on both frontend and backend**
7. **Test edge cases (full projects, closed projects, etc.)**
8. **Keep conditional rendering logic clean and readable**

---

## 🎓 Example Use Cases

### Case 1: Student looking for AI/ML project
1. Goes to `/projects`
2. Filters by "AI/Machine Learning" type
3. Sees skill matching: "4/5 skills matched"
4. Clicks "Request to Join"
5. Writes message about ML experience
6. Submits and waits for approval

### Case 2: Project owner managing applications
1. Receives notification about new request
2. Goes to `/projects/my-requests`
3. Filters to "My AI Project"
4. Sees applicant has 4/5 matching skills
5. Reads their message
6. Approves - project becomes full and closes automatically
7. Sends welcome message via chat

### Case 3: Owner sharing resources with team
1. Browses `/resources`
2. Finds useful ML tutorial
3. Clicks three-dot menu
4. Selects "My AI Project"
5. Resource appears in project's Resources tab
6. Team members can access it

---

**Last Updated:** November 16, 2025  
**Version:** 1.0  
**Status:** Production Ready
