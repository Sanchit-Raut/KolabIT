# Complete API Testing Guide for Beginners

**Welcome!** This guide will walk you through testing every endpoint of the KolabIT API. No prior experience needed! 🚀

---

## What is API Testing?

Think of an API as a waiter in a restaurant:
- You (the client) make a **request** (order food)
- The waiter takes it to the kitchen (backend server)
- The kitchen prepares the food (processes your request)
- The waiter brings back a **response** (your food)

We'll use a tool called `curl` to make these requests from the command line.

---

## Prerequisites

1. ✅ Backend server is running at `http://localhost:5000`
2. ✅ Open a NEW terminal (don't close the server terminal!)
3. ✅ Navigate to project directory

```bash
cd /home/omen/Desktop/Projects/KolabIT
```

---

## Understanding HTTP Methods

- **GET**: Retrieve data (like viewing a menu)
- **POST**: Create new data (like placing an order)
- **PUT**: Update existing data (like modifying your order)
- **DELETE**: Remove data (like canceling your order)

---

## Understanding Status Codes

When you make a request, the server responds with a status code:

- **200 OK**: Success! Everything worked
- **201 Created**: Success! A new resource was created
- **400 Bad Request**: You sent invalid data
- **401 Unauthorized**: You need to login first
- **404 Not Found**: The resource doesn't exist
- **500 Internal Server Error**: Something went wrong on the server

---

## Test 1: Health Check (The Simplest Test!)

### What it does:
Checks if the server is running and responding.

### Command:
```bash
curl http://localhost:5000/health
```

### Expected Output:
```json
{"success":true,"message":"KolabIT API is running","timestamp":"2025-11-02T12:42:47.379Z","version":"1.0.0"}
```

### What this means:
✅ Server is alive and working! You can see:
- `success: true` - Everything is OK
- `message` - Server confirmation
- `timestamp` - Current server time
- `version` - API version (1.0.0)

---

## Test 2: Register a New User

### What it does:
Creates a new user account in the database.

### Command:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Command Breakdown:
- `-X POST`: Use POST method (creating new data)
- `-H "Content-Type: application/json"`: Tell server we're sending JSON
- `-d '{...}'`: The data we're sending (email, password, name)

### Expected Output:
```json
{
  "user": {
    "id": "cm2wj...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What this means:
- ✅ User created successfully!
- You get back the user info
- You get a **token** (think of it as a session ID)
- Save this token! You'll need it for authenticated requests

### If you see an error:
```json
{"message":"User already exists"}
```
This means the email is already registered. Try a different email!

---

## Test 3: Login with Your User

### What it does:
Logs in with the user you just created and gets a new token.

### Command:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### Expected Output:
```json
{
  "user": {
    "id": "cm2wj...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What this means:
✅ Login successful! Save this token for next steps.

---

## Test 4: Get Your Profile (Protected Route)

### What it does:
Retrieves your user profile. This requires authentication!

### IMPORTANT: Replace YOUR_TOKEN_HERE with the actual token from Test 2 or 3!

### Command:
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example with real token:
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTJ3ajg5OXAwMDAwcGtiYzR6aHoxcWt0IiwiaWF0IjoxNzMwNTUyNzg5LCJleHAiOjE3MzExNTc1ODl9.vK8xYxK3-7_example_token"
```

### Expected Output:
```json
{
  "id": "cm2wj...",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "rollNumber": null,
  "department": null,
  "year": null,
  "semester": null,
  "bio": null,
  "avatar": null,
  "isVerified": false,
  "createdAt": "2025-11-02T12:00:00.000Z",
  "updatedAt": "2025-11-02T12:00:00.000Z"
}
```

### What this means:
✅ You successfully accessed a protected route!

### If you see an error:
```json
{"message":"Unauthorized"}
```
Your token is invalid or expired. Go back to Test 3 and get a fresh token.

---

## Test 5: Get All Skills

### What it does:
Retrieves all available skills in the database.

### Command:
```bash
curl http://localhost:5000/api/skills
```

### Expected Output:
```json
[
  {
    "id": "skill_id_1",
    "name": "JavaScript",
    "category": "Programming",
    "description": "JavaScript programming language",
    "icon": "js-icon.png",
    "createdAt": "2025-11-02T12:00:00.000Z"
  },
  {
    "id": "skill_id_2",
    "name": "React",
    "category": "Framework",
    "description": "React.js library",
    "icon": "react-icon.png",
    "createdAt": "2025-11-02T12:00:00.000Z"
  }
]
```

### What this means:
✅ You can see all skills! The list might be empty if no skills were seeded.

---

## Test 6: Add a Skill to Your Profile

### What it does:
Adds a skill to your user profile with a proficiency level.

### Command (replace YOUR_TOKEN_HERE):
```bash
curl -X POST http://localhost:5000/api/users/skills \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "skillName": "JavaScript",
    "proficiencyLevel": "INTERMEDIATE",
    "yearsOfExperience": 2
  }'
```

### Proficiency levels:
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`
- `EXPERT`

### Expected Output:
```json
{
  "id": "user_skill_id",
  "userId": "your_user_id",
  "skillId": "skill_id",
  "proficiencyLevel": "INTERMEDIATE",
  "yearsOfExperience": 2,
  "endorsements": 0,
  "skill": {
    "id": "skill_id",
    "name": "JavaScript",
    "category": "Programming"
  }
}
```

### What this means:
✅ Skill added to your profile!

---

## Test 7: Create a Project

### What it does:
Creates a new collaborative project.

### Command (replace YOUR_TOKEN_HERE):
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build a Todo App",
    "description": "A simple todo application using React and Node.js",
    "type": "ACADEMIC",
    "status": "PLANNING",
    "maxMembers": 5,
    "requiredSkills": ["JavaScript", "React"]
  }'
```

### Project Types:
- `ACADEMIC`: School/university project
- `PERSONAL`: Personal side project
- `COMPETITION`: Hackathon or competition
- `INTERNSHIP`: Internship project

### Expected Output:
```json
{
  "id": "project_id",
  "title": "Build a Todo App",
  "description": "A simple todo application using React and Node.js",
  "type": "ACADEMIC",
  "status": "PLANNING",
  "maxMembers": 5,
  "ownerId": "your_user_id",
  "createdAt": "2025-11-02T12:00:00.000Z",
  "owner": {
    "id": "your_user_id",
    "firstName": "John",
    "lastName": "Doe"
  },
  "members": [],
  "requiredSkills": []
}
```

### What this means:
✅ Project created! You are the owner.

---

## Test 8: Get All Projects

### What it does:
Lists all available projects.

### Command:
```bash
curl http://localhost:5000/api/projects
```

### Expected Output:
```json
{
  "data": [
    {
      "id": "project_id",
      "title": "Build a Todo App",
      "description": "A simple todo application...",
      "type": "ACADEMIC",
      "status": "PLANNING",
      "owner": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### What this means:
✅ You can see all projects, including the one you just created!

---

## Test 9: Search for Users

### What it does:
Searches for users by name or skills.

### Command:
```bash
curl "http://localhost:5000/api/users/search?search=John"
```

### Note: The quotes around the URL are important when using ? in bash!

### Expected Output:
```json
[
  {
    "id": "user_id",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "department": null,
    "year": null
  }
]
```

### What this means:
✅ Found users matching "John"!

---

## Test 10: Update Your Profile

### What it does:
Updates your user profile information.

### Command (replace YOUR_TOKEN_HERE):
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "department": "Computer Science",
    "year": 3,
    "semester": 5,
    "bio": "Passionate about web development and open source!"
  }'
```

### Expected Output:
```json
{
  "id": "user_id",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Computer Science",
  "year": 3,
  "semester": 5,
  "bio": "Passionate about web development and open source!",
  "updatedAt": "2025-11-02T12:30:00.000Z"
}
```

### What this means:
✅ Profile updated successfully!

---

## Quick Testing Script

Save this as `test-api.sh` for quick testing:

```bash
#!/bin/bash

echo "🧪 KolabIT API Testing Script"
echo "=============================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
curl -s http://localhost:5000/api/health
echo -e "\n${GREEN}✓ Done${NC}\n"

# Test 2: Register User
echo -e "${BLUE}Test 2: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }')
echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo -e "${GREEN}✓ Token saved: ${TOKEN:0:20}...${NC}\n"

# Test 3: Get Profile
echo -e "${BLUE}Test 3: Get Profile (Protected)${NC}"
curl -s http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "${GREEN}✓ Done${NC}\n"

# Test 4: Get All Skills
echo -e "${BLUE}Test 4: Get All Skills${NC}"
curl -s http://localhost:5000/api/skills | jq '.'
echo -e "${GREEN}✓ Done${NC}\n"

echo "🎉 All tests completed!"
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Common Issues & Solutions

### Issue 1: "Connection refused"
**Problem**: Server is not running  
**Solution**: Start the server with `npm run dev`

### Issue 2: "Unauthorized" on protected routes
**Problem**: Token is missing or expired  
**Solution**: Login again and use the new token

### Issue 3: "User already exists"
**Problem**: Email is already registered  
**Solution**: Use a different email or login with existing credentials

### Issue 4: curl command not found
**Problem**: curl is not installed  
**Solution**: 
```bash
sudo pacman -S curl  # Arch Linux
```

### Issue 5: "Invalid JSON"
**Problem**: Syntax error in your JSON data  
**Solution**: Check quotes, commas, and brackets carefully

---

## Pro Tips 🎯

1. **Use jq for pretty output**:
```bash
# Install jq
sudo pacman -S jq

# Use with curl
curl http://localhost:5000/api/health | jq '.'
```

2. **Save your token to a variable**:
```bash
# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"SecurePass123!"}' \
  | jq -r '.token')

# Use the token
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

3. **Save responses to files**:
```bash
curl http://localhost:5000/api/skills > skills.json
cat skills.json | jq '.'
```

---

## Next Steps

Once you're comfortable with curl, you can:
1. Try the Postman collection (visual API testing)
2. Build a frontend to interact with these APIs
3. Write automated tests using Jest/Supertest

---

**Happy Testing! 🚀**
