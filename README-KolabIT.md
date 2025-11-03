
# KolabIT - Campus-Centric Skill-Sharing Platform

A comprehensive web-based platform for campus-centric skill-sharing and collaborative learning. This platform connects university students through skill-based collaboration, project partnerships, and community engagement.

## Features

### 🔐 Authentication & User Management
- User registration with email verification
- JWT-based authentication
- Password reset functionality
- User profile management
- Skill endorsement system

### 🎯 Skill Management
- Comprehensive skill database with categories
- User skill profiles with proficiency levels
- Skill search and filtering
- Skill-based user discovery
- Skill leaderboards and statistics

### 🤝 Project Collaboration
- Project creation and management
- Join request system
- Project member management
- Task management and assignment
- Project-based skill requirements

### 📚 Resource Sharing Hub
- File upload and sharing
- Resource categorization by subject and semester
- Download tracking
- Resource rating and review system
- Popular resources discovery

### 💬 Community Bulletin Board
- Discussion posts and announcements
- Comment system
- Post likes and engagement
- Tag-based categorization
- Community interaction features

### 🏆 Gamification System
- Badge system with multiple categories
- Achievement tracking
- Leaderboards
- Skill-based scoring
- Community contribution rewards

### 🔔 Real-time Notifications
- Socket.io integration
- Real-time notifications
- Project collaboration updates
- Community engagement alerts

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer
- **Testing**: Jest with Supertest

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KolabIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kolabit"
   
   # JWT Configuration
   JWT_SECRET="752af32294d9b3bf1733d2fd39c4ce5247b342b587b79081143b399aa7bfe034f1c429ee192b3e723301add0a3126c113a9a6f4fa3b087035ed0d6885e14c969"
   JWT_EXPIRES_IN="7d"
   
   # Password Hashing
   BCRYPT_SALT_ROUNDS=12
   
   # File Upload
   UPLOAD_PATH="./uploads"
   MAX_FILE_SIZE=10485760
   
   # Email Configuration
   EMAIL_SERVICE_KEY="your-email-service-key"
   EMAIL_FROM="noreply@kolabit.com"
   
   # Client Configuration
   CLIENT_URL="http://localhost:3000"
   
   # Server Configuration
   PORT=5000
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # (Optional) Open Prisma Studio
   npm run db:studio
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `DELETE /api/auth/account` - Delete account (protected)

### User Management Endpoints

- `GET /api/users/search` - Search users
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users/:userId/skills` - Get user skills
- `GET /api/users/:userId/stats` - Get user statistics
- `POST /api/users/skills` - Add skill to profile (protected)
- `PUT /api/users/skills/:skillId` - Update user skill (protected)
- `DELETE /api/users/skills/:skillId` - Remove user skill (protected)
- `POST /api/users/:userId/skills/:skillId/endorse` - Endorse user skill (protected)

### Skill Management Endpoints

- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/:id` - Get skill by ID
- `GET /api/skills/search/:term` - Search skills
- `GET /api/skills/categories/list` - Get skill categories
- `GET /api/skills/popular/:limit?` - Get popular skills
- `GET /api/skills/:id/stats` - Get skill statistics
- `GET /api/skills/:id/leaderboard/:limit?` - Get skill leaderboard

### Project Management Endpoints

- `POST /api/projects` - Create project (protected)
- `GET /api/projects` - Get projects with filters
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/join-request` - Request to join project (protected)
- `PUT /api/projects/:id/join-request/:requestId` - Accept/reject join request (protected)
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/tasks` - Create project task (protected)
- `PUT /api/projects/:id/tasks/:taskId` - Update project task (protected)

### Resource Management Endpoints

- `POST /api/resources` - Upload resource (protected)
- `GET /api/resources` - Get resources with filters
- `GET /api/resources/popular` - Get popular resources
- `GET /api/resources/:id` - Get resource by ID
- `PUT /api/resources/:id` - Update resource (protected)
- `DELETE /api/resources/:id` - Delete resource (protected)
- `POST /api/resources/:id/download` - Track download
- `POST /api/resources/:id/rating` - Rate resource (protected)
- `GET /api/resources/:id/ratings` - Get resource ratings
- `GET /api/resources/:id/stats` - Get resource statistics

### Community Endpoints

- `POST /api/posts` - Create post (protected)
- `GET /api/posts` - Get posts with filters
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/comments` - Create comment (protected)
- `PUT /api/posts/:id/comments/:commentId` - Update comment (protected)
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

### Badge & Gamification Endpoints

- `GET /api/badges` - Get all badges
- `GET /api/badges/:userId` - Get user badges
- `POST /api/badges/check` - Check and award badges (protected)
- `GET /api/badges/leaderboard/:skillId?` - Get leaderboard

### Notification Endpoints

- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: User profiles and authentication
- **Skill**: Available skills and categories
- **UserSkill**: User skill profiles with proficiency levels
- **Project**: Project information and collaboration
- **ProjectMember**: Project membership and roles
- **Resource**: Shared resources and files
- **Post**: Community posts and discussions
- **Comment**: Post comments
- **Badge**: Achievement badges
- **Notification**: User notifications
- **Message**: Direct messaging (future feature)

## Development

### Project Structure

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
├── tests/             # Test files
└── app.ts             # Express app setup
```

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive error handling
- Input validation on all endpoints
- Proper HTTP status codes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.