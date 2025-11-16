# 🧪 JOIN REQUEST SYSTEM - TESTING GUIDE

## 🎯 Quick Test Steps

### **Prerequisites**
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ You need **TWO user accounts** (one project owner, one regular user)

---

## 📝 Test Scenario

### **Setup: Create Test Accounts**

#### **Account 1: Project Owner (Alice)**
- Email: `alice@example.com`
- Password: `password123`
- **Role:** Will create a project

#### **Account 2: Regular User (Bob)**
- Email: `bob@example.com`
- Password: `password123`
- **Role:** Will request to join Alice's project

---

## ✅ Test Flow

### **Step 1: Login as Alice (Project Owner)**
1. Navigate to `http://localhost:3000/login`
2. Login with Alice's credentials
3. Go to `http://localhost:3000/projects/create`
4. Create a new project:
   - Title: "Test Project for Join Requests"
   - Description: "Testing join request notifications"
   - Type: "ACADEMIC"
   - Max Members: 5
   - Add some required skills
5. Click "Create Project"
6. ✅ **Verify:** Project created successfully

---

### **Step 2: Login as Bob (Regular User)**
1. **Logout** from Alice's account
2. Login with Bob's credentials
3. Go to `http://localhost:3000/projects`
4. Find "Test Project for Join Requests"
5. Click "View Details"
6. Click **"Apply to Join"** button
7. **Modal opens:**
   - Optional message: "Hi, I'd love to join this project!"
8. Click **"Submit Join Request"**
9. ✅ **Verify:** Success toast appears: "Join request sent successfully"

---

### **Step 3: Check Alice's Notifications**
1. **Logout** from Bob's account
2. Login as Alice
3. Click the **notification bell** icon in header
4. ✅ **Expected:** You should see a notification:
   - Title: "New Join Request"
   - Message: "Bob wants to join 'Test Project for Join Requests'"
5. Click the notification → should navigate to join requests page

---

### **Step 4: View Join Requests Page**
1. While logged in as Alice, navigate to:
   ```
   http://localhost:3000/projects/my-requests
   ```
2. ✅ **Expected:** You should see:
   - Bob's join request listed
   - Bob's avatar, name, department, roll number
   - "Matched Skills" badge (if any)
   - Request message: "Hi, I'd love to join this project!"
   - Timestamp: "X minutes ago"
   - Three buttons: **Chat**, **Approve**, **Reject**

---

### **Step 5: Test Approve Function**
1. Click **"Approve"** button on Bob's request
2. ✅ **Expected:**
   - Success toast: "Join request approved successfully"
   - Request disappears from "Pending" tab
   - Appears in "Accepted" tab

---

### **Step 6: Check Bob's Notification**
1. **Logout** from Alice's account
2. Login as Bob
3. Click the **notification bell** icon
4. ✅ **Expected:** You should see a notification:
   - Title: "Join Request Accepted"
   - Message: "Your request to join 'Test Project for Join Requests' has been accepted! Welcome to the team."

---

### **Step 7: Verify Bob is Now a Member**
1. While logged in as Bob, go to the project details page
2. ✅ **Expected:**
   - You should see Bob in the "Team Members" section
   - Role: "MEMBER"
   - "Apply to Join" button should be gone

---

## 🧪 Additional Tests

### **Test: Reject Function**
1. Login as Alice
2. Have another user (Charlie) submit a join request
3. Go to `/projects/my-requests`
4. Click **"Reject"** on Charlie's request
5. ✅ **Verify:**
   - Success toast appears
   - Request moves to "Rejected" tab
6. Login as Charlie
7. ✅ **Verify:**
   - Notification: "Your request to join '...' was not accepted at this time"

---

### **Test: Auto-Close When Full**
1. Login as Alice
2. Create a project with **Max Members = 2**
3. Have 2 users submit join requests
4. Approve both requests
5. ✅ **Verify:**
   - After approving the 2nd request, project status changes to "CLOSED"
   - No more users can submit join requests

---

### **Test: Chat Button**
1. Login as Alice
2. Go to `/projects/my-requests`
3. Click **"Chat"** button on a request
4. ✅ **Expected:**
   - Modal opens OR navigates to messages page with that user

---

## 🐛 Debugging Tips

### **If notifications don't appear:**
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify notification is created in database:
   ```sql
   SELECT * FROM notifications WHERE user_id = '<alice-id>' ORDER BY created_at DESC LIMIT 5;
   ```

### **If join requests don't show:**
1. Check browser console → Network tab
2. Look for request to `/api/projects/:id/join-requests`
3. Check response → should have status 200 and data array
4. Verify owner is logged in (only owner can see join requests)

### **If approve/reject doesn't work:**
1. Check browser console for errors
2. Look for PUT request to `/api/projects/:id/join-request/:requestId`
3. Verify request body has `{ status: "ACCEPTED" }` or `{ status: "REJECTED" }`

---

## 📊 Expected Database State

### **After Bob submits join request:**
```sql
-- join_requests table
SELECT * FROM join_requests WHERE project_id = '<project-id>';
```
**Expected:**
- 1 row with status = 'PENDING', user_id = '<bob-id>'

### **After Alice approves:**
```sql
-- join_requests table
SELECT * FROM join_requests WHERE id = '<request-id>';
```
**Expected:**
- status = 'ACCEPTED'

```sql
-- project_members table
SELECT * FROM project_members WHERE project_id = '<project-id>' AND user_id = '<bob-id>';
```
**Expected:**
- 1 row with role = 'MEMBER'

```sql
-- notifications table
SELECT * FROM notifications WHERE user_id = '<bob-id>' ORDER BY created_at DESC LIMIT 1;
```
**Expected:**
- title = 'Join Request Accepted'
- type = 'PROJECT'

---

## ✅ Success Criteria

- [ ] Bob can submit join request
- [ ] Alice receives notification about new request
- [ ] Alice can see request in `/projects/my-requests`
- [ ] Alice can approve request
- [ ] Bob receives notification about approval
- [ ] Bob appears in project members list
- [ ] Project auto-closes when reaching max members
- [ ] Reject function works and sends notification
- [ ] No console errors
- [ ] All API responses are 200/201

---

## 🎉 All Tests Pass?

If all tests pass, the join request system is fully functional! 🚀

**Next features to test:**
- Edit Project (owner only)
- Link Resources to Project
- Team member role changes
- Skill matching algorithm

---

**Document Created:** November 16, 2025
**Last Updated:** November 16, 2025
