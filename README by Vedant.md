# KolabIT Setup Guide

This guide will help you set up and run the KolabIT platform on your local machine.

## Prerequisites

Before starting, make sure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)

## Step 1: Install PostgreSQL

### For Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### For Windows:
1. Download PostgreSQL installer from [official website](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Keep note of the password you set for the postgres user
4. Add PostgreSQL bin directory to your PATH if the installer didn't do it

### For macOS:
```bash
# Using Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql
```

## Step 2: Create Database and Schema

1. Login to PostgreSQL:
```bash
# For Linux/macOS (as postgres user)
sudo -u postgres psql

# For Windows (open Command Prompt)
psql -U postgres
```

2. Create database:
```sql
CREATE DATABASE kolabit;
```

3. Connect to the database:
```sql
\c kolabit
```

4. Import schema:
```bash
# For Linux/macOS
psql -U postgres -d kolabit -f schema/kolabit-schema.sql

# For Windows
psql -U postgres -d kolabit -f "path\to\kolabit-schema.sql"
```

## Step 3: Configure Environment Variables

1. Backend Setup:
```bash
# Navigate to backend directory
cd KolabIT_back

# Copy example env file
cp env.example .env
```

2. Edit `.env` file and add your configuration:
```env
# Database URL format: postgresql://user:password@localhost:5432/kolabit
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/kolabit"

# JWT Secret (generate a random string)
JWT_SECRET="your_jwt_secret_key"

# Server Port (optional, defaults to 5000)
PORT=5000

# File Upload Settings
UPLOAD_DIR="uploads"
MAX_FILE_SIZE="40mb"
```

3. Frontend Setup:
```bash
# Navigate to frontend directory
cd ../navin-front

# Create .env.local file
touch .env.local
```

4. Add frontend environment variables:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Step 4: Install Dependencies

1. Install backend dependencies:
```bash
# In KolabIT_back directory
npm install
```

2. Install frontend dependencies:
```bash
# In navin-front directory
npm install
```

## Step 5: Generate Prisma Client

```bash
# In KolabIT_back directory
npx prisma generate
```

## Step 6: Run the Application

1. Start backend server:
```bash
# In KolabIT_back directory
npm run dev
```

2. In a new terminal, start frontend server:
```bash
# In navin-front directory
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Common Issues and Solutions

### Database Connection Issues
- Make sure PostgreSQL service is running
- Verify database credentials in .env file
- Check if database exists and is accessible

### Port Conflicts
- If ports 3000 or 5000 are in use, you can change them:
  - Backend: Set different PORT in .env
  - Frontend: Use `npm run dev -- -p 3001` for a different port

### File Upload Issues
- Make sure uploads directory exists in backend
- Check file size limits in .env match your needs
- Verify proper permissions on uploads directory

## Additional Notes

- For development, keep both frontend and backend servers running
- Use different terminals for frontend and backend
- Monitor server logs for errors
- Check browser console for frontend issues
- Use `npm run build` for production builds

## Security Considerations

- Never commit .env files
- Use strong JWT secrets in production
- Set appropriate file upload limits
- Configure CORS settings for production
- Use HTTPS in production environment