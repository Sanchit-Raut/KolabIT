# KolabIT - Complete Setup Guide for Arch Linux (Hyprland)

## Overview
This guide will help you set up the KolabIT backend on a fresh Arch Linux installation running Hyprland.

---

## 📋 System Requirements

### Minimum Requirements
- **OS**: Arch Linux (with Hyprland)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB for dependencies + database
- **Network**: Internet connection for package installation

---

## 🔧 Part 1: Install System Dependencies

### 1.1 Update System
```bash
sudo pacman -Syu
```

### 1.2 Install Node.js and npm
```bash
# Install Node.js (v20 LTS recommended)
sudo pacman -S nodejs npm

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### 1.3 Install PostgreSQL
```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Verify installation
postgres --version  # Should show 16.x or higher
```

### 1.4 Install Git (if not already installed)
```bash
sudo pacman -S git
git --version
```

### 1.5 Optional: Install Build Tools
```bash
# Required for some native npm modules
sudo pacman -S base-devel
```

---

## 🗄️ Part 2: PostgreSQL Database Setup

### 2.1 Initialize PostgreSQL
```bash
# Initialize the database cluster (first time only)
sudo -u postgres initdb --locale=en_US.UTF-8 -D /var/lib/postgres/data

# Enable and start PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Check service status
sudo systemctl status postgresql
```

### 2.2 Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run these commands:
```

```sql
-- Create database user
CREATE USER kolabit_user WITH PASSWORD 'your_secure_password_here';

-- Create database
CREATE DATABASE kolabit_dev;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kolabit_dev TO kolabit_user;

-- Grant schema privileges (required for Prisma)
\c kolabit_dev
GRANT ALL ON SCHEMA public TO kolabit_user;
ALTER DATABASE kolabit_dev OWNER TO kolabit_user;

-- Exit PostgreSQL shell
\q
```

### 2.3 Test Database Connection
```bash
# Test connection with created user
psql -U kolabit_user -d kolabit_dev -h localhost -W

# If successful, you'll see the PostgreSQL prompt
# Exit with \q
```

---

## 📦 Part 3: Project Setup

### 3.1 Navigate to Project Directory
```bash
cd /home/omen/Desktop/Projects/KolabIT
```

### 3.2 Install Node.js Dependencies
```bash
# Clean install (recommended for fresh setup)
rm -rf node_modules package-lock.json
npm install

# This will install all dependencies from package.json
# Expected: ~576 packages
```

### 3.3 Configure Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor (vim, code, etc.)
```

**Update these critical values in `.env`:**
```env
# Database - UPDATE THIS
DATABASE_URL="postgresql://kolabit_user:your_secure_password_here@localhost:5432/kolabit_dev?schema=public"

# JWT Secret - CHANGE THIS to a random string
JWT_SECRET="generate-a-random-secret-key-here-use-openssl-rand-base64-32"
JWT_EXPIRES_IN="7d"

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# File Upload
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760

# Email (use real SMTP for production, test values for development)
EMAIL_SERVICE_KEY="test-email-key"
EMAIL_FROM="noreply@kolabit.dev"

# Client Configuration
CLIENT_URL="http://localhost:3000"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate a secure JWT secret:**
```bash
# Generate random JWT secret
openssl rand -base64 32
# Copy the output and paste it as JWT_SECRET value in .env
```

### 3.4 Set Up Database Schema
```bash
# Generate Prisma client
npm run db:generate

# Push database schema to PostgreSQL
npm run db:push

# Expected output: "The database is now in sync with the Prisma schema"
```

### 3.5 Seed Database with Sample Data
```bash
# Run the seed script to populate initial data
npx prisma db seed

# Expected output: 
# ✅ Created test users, projects, resources, etc.
# Test credentials will be displayed
```

### 3.6 Create Required Directories
```bash
# Create uploads directory for file storage
mkdir -p uploads

# Set proper permissions
chmod 755 uploads
```

---

## 🚀 Part 4: Build and Run

### 4.1 Build TypeScript to JavaScript
```bash
npm run build

# This compiles TypeScript files to JavaScript in ./dist folder
# Expected: No errors, compilation successful
```

### 4.2 Start Development Server
```bash
# Start in development mode (with auto-reload)
npm run dev

# Expected output:
# 🚀 Server running on http://localhost:5000
# 📊 Database connected successfully
# ⚡ Ready to accept requests
```

**Keep this terminal open - the server is now running!**

### 4.3 Test API Endpoints (in a new terminal)
```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"API is running"}

# Test user registration (example)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 🧪 Part 5: Run Tests (Optional)

### 5.1 Run All Tests
```bash
# Run Jest test suite
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 🛠️ Part 6: Additional Tools

### 6.1 Prisma Studio (Database GUI)
```bash
# Open Prisma Studio in browser
npm run db:studio

# Opens at: http://localhost:5555
# Browse and edit database records visually
```

### 6.2 View Database Directly
```bash
# Connect to PostgreSQL
psql -U kolabit_user -d kolabit_dev -h localhost

# Useful commands:
\dt          # List all tables
\d users     # Describe users table
SELECT * FROM users;  # Query users
\q           # Exit
```

---

## 📊 Dependency Summary

### Production Dependencies (15)
- **express** (^4.18.2) - Web framework
- **@prisma/client** (^5.7.1) - Database ORM
- **jsonwebtoken** (^9.0.2) - JWT authentication
- **bcryptjs** (^2.4.3) - Password hashing
- **socket.io** (^4.7.4) - Real-time communication
- **cors** (^2.8.5) - CORS middleware
- **helmet** (^7.1.0) - Security headers
- **compression** (^1.7.4) - Response compression
- **morgan** (^1.10.0) - HTTP logging
- **express-validator** (^7.0.1) - Input validation
- **express-rate-limit** (^7.1.5) - Rate limiting
- **multer** (^1.4.5-lts.1) - File upload handling
- **nodemailer** (^6.9.7) - Email sending
- **dotenv** (^16.3.1) - Environment variables
- **axios** (^1.11.0) - HTTP client
- **uuid** (^9.0.1) - UUID generation

### Development Dependencies (13)
- **typescript** (^5.3.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution
- **ts-node-dev** (^2.0.0) - Dev server with auto-reload
- **jest** (^29.7.0) - Testing framework
- **ts-jest** (^29.1.1) - TypeScript Jest preset
- **supertest** (^6.3.3) - HTTP testing
- **@types/** packages - TypeScript definitions
- **prisma** (^5.7.1) - Prisma CLI

**Total: ~576 packages** (including sub-dependencies)

---

## 🔐 Security Checklist

- [ ] Changed `DATABASE_URL` with secure password
- [ ] Generated unique `JWT_SECRET` (32+ characters)
- [ ] Set `NODE_ENV` to `development` (never use `production` on dev machine)
- [ ] Uploads directory has correct permissions (755)
- [ ] PostgreSQL only accepts localhost connections (default)
- [ ] `.env` file is in `.gitignore` (already configured)

---

## 🐛 Troubleshooting

### PostgreSQL won't start
```bash
# Check logs
sudo journalctl -u postgresql -n 50

# Reinitialize if needed
sudo rm -rf /var/lib/postgres/data
sudo -u postgres initdb --locale=en_US.UTF-8 -D /var/lib/postgres/data
sudo systemctl restart postgresql
```

### Database connection refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
sudo -u postgres psql -l | grep kolabit

# Test connection
psql -U kolabit_user -d kolabit_dev -h localhost -W
```

### Port 5000 already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>

# Or change PORT in .env file
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client out of sync
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### TypeScript build errors
```bash
# Clean build directory
rm -rf dist

# Rebuild
npm run build
```

---

## 📝 Quick Reference Commands

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run tests
npm test

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push       # Sync schema to database
npm run db:migrate    # Create migration
npm run db:studio     # Open Prisma Studio GUI

# Seed database
npx prisma db seed
```

---

## 🌐 API Base URL

- **Development**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 📚 Next Steps

1. ✅ **Install system dependencies** (Node.js, PostgreSQL)
2. ✅ **Set up PostgreSQL database**
3. ✅ **Install Node.js packages**
4. ✅ **Configure environment variables**
5. ✅ **Generate Prisma client and sync schema**
6. ✅ **Seed database**
7. ✅ **Build project**
8. ✅ **Start development server**
9. 📖 **Read API documentation** in `README.md`
10. 🧪 **Test API endpoints** with curl or Postman
11. 💻 **Start building your frontend!**

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in terminal
3. Check PostgreSQL logs: `sudo journalctl -u postgresql`
4. Check application logs in the terminal running `npm run dev`
5. Verify all environment variables in `.env` are correct

---

## ✅ Setup Verification Checklist

Run these commands to verify your setup:

```bash
# 1. Node.js installed
node --version && npm --version

# 2. PostgreSQL running
sudo systemctl status postgresql

# 3. Database exists
psql -U kolabit_user -d kolabit_dev -h localhost -c "SELECT 1" -W

# 4. Dependencies installed
[ -d "node_modules" ] && echo "✅ Dependencies installed" || echo "❌ Run npm install"

# 5. .env file exists
[ -f ".env" ] && echo "✅ .env configured" || echo "❌ Copy env.example to .env"

# 6. Prisma client generated
[ -d "node_modules/@prisma/client" ] && echo "✅ Prisma client ready" || echo "❌ Run npm run db:generate"

# 7. TypeScript compiled
[ -d "dist" ] && echo "✅ Build complete" || echo "❌ Run npm run build"

# 8. Uploads directory exists
[ -d "uploads" ] && echo "✅ Uploads ready" || echo "❌ Run mkdir uploads"
```

---

**Happy Coding! 🚀**
