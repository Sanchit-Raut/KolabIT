# KolabIT API Postman Collection

## Overview

This comprehensive Postman collection provides complete testing coverage for the KolabIT backend API. The collection includes all endpoints for authentication, user management, skill management, project collaboration, resource sharing, community features, notifications, and gamification.

## Collection Structure

```
KolabIT API Collection/
├── 🔧 Environment Setup
│   └── Health Check
├── 🔐 Authentication
│   ├── User Registration
│   ├── User Login
│   ├── Admin Login
│   ├── Login with Invalid Credentials
│   ├── Get User Profile
│   └── Update User Profile
├── 👤 User Management
│   ├── Search Users by Skills
│   ├── Get User by ID
│   ├── Get User Skills
│   ├── Add Skill to User
│   ├── Update User Skill
│   ├── Remove User Skill
│   └── Get User Stats
├── 🎯 Skill Management
│   ├── Get All Skills
│   ├── Get Skills by Category
│   ├── Get Skill by ID
│   ├── Search Skills
│   ├── Get Skill Categories
│   ├── Get Popular Skills
│   ├── Get Skill Statistics
│   ├── Get Skill Leaderboard
│   ├── Create New Skill (Admin)
│   ├── Update Skill (Admin)
│   └── Delete Skill (Admin)
├── 🚀 Project Management
│   ├── Create Project
│   ├── Get All Projects
│   ├── Get Project Details
│   ├── Update Project
│   ├── Get Project Members
│   ├── Send Join Request
│   ├── Get Join Requests
│   ├── Accept Join Request
│   ├── Create Project Task
│   ├── Get Project Tasks
│   ├── Update Project Task
│   └── Delete Project
├── 📚 Resource Sharing
│   ├── Upload Resource
│   ├── Get All Resources
│   ├── Get Resource by ID
│   ├── Download Resource
│   ├── Rate Resource
│   ├── Get Resource Ratings
│   ├── Get Resource Statistics
│   ├── Get Popular Resources
│   ├── Update Resource
│   └── Delete Resource
├── 💬 Community Features
│   ├── Create Post
│   ├── Get All Posts
│   ├── Get Post by ID
│   ├── Update Post
│   ├── Add Comment to Post
│   ├── Get Post Comments
│   ├── Like Post
│   ├── Unlike Post
│   ├── Get Popular Posts
│   ├── Search Posts
│   └── Delete Post
├── 🔔 Notifications
│   ├── Get User Notifications
│   ├── Get Unread Notifications Count
│   ├── Mark Notification as Read
│   ├── Mark All Notifications as Read
│   ├── Delete Notification
│   └── Get Notifications by Type
├── 🏆 Gamification
│   ├── Get All Badges
│   ├── Get Badge by ID
│   ├── Get User Badges
│   ├── Check for New Badges
│   ├── Get Badge Leaderboard
│   ├── Get User Achievement Stats
│   ├── Get Badge Categories
│   └── Get Badge Progress
└── 🧪 Edge Cases & Error Scenarios
    ├── Access Protected Route Without Token
    ├── Access with Invalid Token
    ├── Create Project with Invalid Data
    ├── Upload Large File (Test file size limit)
    ├── SQL Injection Attempt
    ├── XSS Attempt in Post Content
    ├── Rate Limiting Test
    ├── Access Non-existent Resource
    ├── Invalid JSON in Request Body
    └── Empty Request Body
```

## Setup Instructions

### 1. Import Collection and Environment

1. **Import Collection**: Import `KolabIT_Complete_Collection.json` into Postman
2. **Import Environment**: Import `KolabIT_Environment.json` into Postman
3. **Set Environment**: Select the KolabIT Environment in the environment dropdown

### 2. Configure Environment Variables

Update the following variables in the environment:

```json
{
  "baseUrl": "http://localhost:5000/api",
  "authToken": "",
  "userId": "",
  "projectId": "",
  "skillId": "",
  "resourceId": "",
  "postId": "",
  "notificationId": "",
  "refreshToken": "",
  "adminToken": "",
  "adminUserId": ""
}
```

### 3. Start the Backend Server

Make sure the KolabIT backend server is running:

```bash
cd /path/to/kolabit-backend
npm run dev
```

The server should be running on `http://localhost:5000`

## Usage Instructions

### 1. Authentication Flow

1. **Start with Health Check**: Run the Health Check request to verify the server is running
2. **Login**: Use either "User Login" or "Admin Login" to authenticate
3. **Auto-token Storage**: The collection automatically stores the auth token for subsequent requests

### 2. Sequential Testing

Some requests depend on previous ones:

1. **Login** → **Get User Profile** → **Update Profile**
2. **Get All Skills** → **Add Skill to User** → **Update User Skill**
3. **Create Project** → **Send Join Request** → **Accept Join Request**
4. **Create Post** → **Add Comment** → **Like Post**

### 3. Test Data

The collection uses realistic test data:

- **Test User**: `test@kolabit.com` / `TestPass123!`
- **Admin User**: `admin@kolabit.com` / `AdminPass123!`
- **Sample Projects**: E-commerce Platform, React Study Group
- **Sample Resources**: Data Structures Notes, JavaScript Fundamentals

### 4. File Upload Testing

For file upload tests:
1. Prepare test files (PDF, images, documents)
2. Use the file picker in the request body
3. Ensure files are under the size limit (10MB)

## Test Scripts

### Collection-Level Scripts

**Pre-request Script**:
- Auto-refreshes token if expired
- Validates token format

**Test Script**:
- Global response time validation (< 2 seconds)
- Standard response format validation
- Success/error response structure validation

### Request-Level Scripts

Each request includes specific test scripts:

```javascript
// Example: Registration test
pm.test('Registration successful', function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('user');
    pm.expect(response.data).to.have.property('token');
    
    // Store user data for future requests
    pm.environment.set('userId', response.data.user.id);
    pm.environment.set('authToken', response.data.token);
});
```

## Collection Runner

### Running the Complete Collection

1. **Open Collection Runner**: Click "Run" on the collection
2. **Select Environment**: Choose "KolabIT Environment"
3. **Configure Settings**:
   - Iterations: 1
   - Delay: 1000ms between requests
   - Data: None (uses environment variables)
4. **Run**: Click "Run KolabIT API Collection"

### Running Specific Folders

1. **Select Folder**: Choose specific folder (e.g., "Authentication")
2. **Run Folder**: Click "Run" on the selected folder
3. **Monitor Results**: Check test results and response times

## Monitoring and CI/CD

### Postman Monitoring

1. **Create Monitor**: Set up Postman monitoring for continuous testing
2. **Schedule**: Run every 5 minutes during business hours
3. **Alerts**: Configure email/Slack alerts for failures
4. **Environment**: Use production environment for monitoring

### Newman (Command Line)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run KolabIT_Complete_Collection.json -e KolabIT_Environment.json

# Run with report
newman run KolabIT_Complete_Collection.json -e KolabIT_Environment.json --reporters cli,html --reporter-html-export report.html
```

## Error Scenarios Testing

The "Edge Cases & Error Scenarios" folder includes:

- **Authentication Errors**: Invalid tokens, expired tokens
- **Validation Errors**: Invalid data, missing required fields
- **Security Tests**: SQL injection, XSS attempts
- **Rate Limiting**: Multiple rapid requests
- **File Upload Limits**: Large file uploads
- **Resource Not Found**: Non-existent endpoints

## Performance Testing

### Response Time Validation

All requests include response time validation:

```javascript
pm.test('Response time is reasonable', function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### Load Testing

For load testing:
1. Use Collection Runner with multiple iterations
2. Increase delay between requests
3. Monitor server performance
4. Check for memory leaks

## Troubleshooting

### Common Issues

1. **Server Not Running**: Ensure backend server is running on port 5000
2. **Authentication Errors**: Check if test users exist in database
3. **File Upload Issues**: Verify file size limits and file types
4. **Database Errors**: Ensure database is properly seeded

### Debug Mode

Enable debug mode in Postman:
1. Go to Console (View → Show Postman Console)
2. Check request/response details
3. Verify environment variables
4. Check test script execution

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
Authorization: Bearer {{authToken}}
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Contributing

### Adding New Tests

1. **Create Request**: Add new request to appropriate folder
2. **Add Tests**: Include validation tests in the request
3. **Update Environment**: Add new variables if needed
4. **Document**: Update this README with new test details

### Modifying Existing Tests

1. **Test Scripts**: Update test scripts for new validation rules
2. **Request Data**: Modify request bodies for new requirements
3. **Environment Variables**: Update variable names if changed
4. **Documentation**: Update relevant documentation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the test scripts for validation logic
3. Verify environment variables are set correctly
4. Ensure the backend server is running and accessible

## Version History

- **v1.0.0**: Initial collection with all core endpoints
- **v1.1.0**: Added edge cases and error scenarios
- **v1.2.0**: Enhanced test scripts and validation
- **v1.3.0**: Added performance testing and monitoring

---

**Note**: This collection is designed for testing the KolabIT backend API. Ensure the backend server is running and properly configured before running the tests.
