# Database Setup & Configuration Guide

## Current Status Analysis

### Database Configuration Options

Your `.env` file has been updated with multiple database connection options. Choose the one that matches your setup:

---

## Option 1: Local PostgreSQL (Recommended for Development)

### Step 1: Create Database and User
```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Run these SQL commands:
```

```sql
-- Create user
CREATE USER kolabit_user WITH PASSWORD 'kolabit_password';

-- Create database
CREATE DATABASE kolabit_dev;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kolabit_dev TO kolabit_user;

-- Connect to the database
\c kolabit_dev

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO kolabit_user;
ALTER DATABASE kolabit_dev OWNER TO kolabit_user;

-- Exit
\q
```

### Step 2: Update .env
Use this DATABASE_URL in your .env:
```
DATABASE_URL="postgresql://kolabit_user:kolabit_password@localhost:5432/kolabit_dev?schema=public"
```

### Step 3: Initialize Database
```bash
cd "/home/omen/Desktop/Projects/Mini Project"
npm run db:push
npm run db:setup
```

---

## Option 2: Use Default Postgres User (Quick Setup)

### Step 1: Create Database
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE kolabit;
\q
```

### Step 2: Update .env
Use this DATABASE_URL in your .env:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kolabit?schema=public"
```

### Step 3: Initialize Database
```bash
cd "/home/omen/Desktop/Projects/Mini Project"
npm run db:push
npm run db:setup
```

---

## Option 3: Docker PostgreSQL

If using Docker for PostgreSQL:

### Step 1: Update .env
Use this DATABASE_URL in your .env:
```
DATABASE_URL="postgresql://username:password@postgres:5432/kolabit?schema=public"
```

### Step 2: Make sure Docker container is running
```bash
docker ps | grep postgres
```

---

## Update PLANNING Status to RECRUITING

After setting up the database, run this SQL to update project statuses:

### Method 1: Direct SQL
```bash
# For local PostgreSQL
psql -U kolabit_user -d kolabit_dev -c "UPDATE projects SET status = 'RECRUITING' WHERE status = 'PLANNING';"

# Or for default postgres user
sudo -u postgres psql -d kolabit -c "UPDATE projects SET status = 'RECRUITING' WHERE status = 'PLANNING';"
```

### Method 2: Using Prisma Studio
```bash
cd "/home/omen/Desktop/Projects/Mini Project"
npx prisma studio
# Then manually edit projects table to change status from PLANNING to RECRUITING
```

---

## Verify Setup

### Check Database Connection
```bash
cd "/home/omen/Desktop/Projects/Mini Project"
npm run dev
# Server should start without database errors
```

### Check Database Content
```bash
# Access Prisma Studio
npx prisma studio
# Opens browser at http://localhost:5555
```

### Test API
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## Troubleshooting

### Error: "database does not exist"
- Run: `sudo -u postgres createdb kolabit_dev`
- Or create manually using psql

### Error: "password authentication failed"
- Check your DATABASE_URL credentials
- Verify user exists: `sudo -u postgres psql -c "\\du"`

### Error: "permission denied for schema public"
- Run the GRANT commands from Option 1, Step 1

### Error: "could not translate host name postgres"
- You're using Docker DATABASE_URL but PostgreSQL is local
- Switch to local DATABASE_URL (Option 1 or 2)

---

## Environment Variables Reference

All variables currently configured in your .env:

| Variable | Current Value | Purpose |
|----------|--------------|---------|
| DATABASE_URL | (multiple options) | PostgreSQL connection string |
| JWT_SECRET | (secure random) | JWT token encryption key |
| JWT_EXPIRES_IN | 7d | JWT token expiration time |
| BCRYPT_SALT_ROUNDS | 12 | Password hashing strength |
| UPLOAD_PATH | ./uploads | File upload directory |
| MAX_FILE_SIZE | 10485760 | Max upload size (10MB) |
| EMAIL_SERVICE_KEY | your-email-service-key | Email service API key |
| EMAIL_FROM | noreply@kolabit.com | Email sender address |
| CLIENT_URL | http://localhost:3000 | Frontend URL for CORS |
| PORT | 5000 | Backend server port |
| NODE_ENV | development | Environment mode |
| RATE_LIMIT_WINDOW_MS | 900000 | Rate limit window (15 min) |
| RATE_LIMIT_MAX_REQUESTS | 100 | Max requests per window |

---

## Quick Start Commands

```bash
# 1. Navigate to project
cd "/home/omen/Desktop/Projects/Mini Project"

# 2. Install dependencies (if needed)
npm install

# 3. Generate Prisma client
npm run db:generate

# 4. Push database schema
npm run db:push

# 5. Seed initial data
npm run db:setup

# 6. Update PLANNING to RECRUITING
psql -U postgres -d kolabit -c "UPDATE projects SET status = 'RECRUITING' WHERE status = 'PLANNING';"

# 7. Start backend server
npm run dev

# 8. In another terminal, start frontend
cd Frontend
npm run dev
```

---

## Need Help?

1. Check if PostgreSQL is running: `sudo systemctl status postgresql`
2. Check server logs: `tail -f server.log`
3. Check Prisma logs: Look for database connection errors in terminal
4. Test database connection: `psql -U postgres -d kolabit -c "SELECT version();"`
