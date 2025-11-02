#!/bin/bash

echo "🚀 Setting up KolabIT - Campus-Centric Skill-Sharing Platform"
echo "=============================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL (v13 or higher) first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your database credentials and other configuration"
    echo "   Edit .env file and then run this script again"
    exit 0
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    echo "   Please check your DATABASE_URL in .env file"
    exit 1
fi

# Setup initial data
echo "🌱 Setting up initial data..."
npm run db:setup

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup initial data"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Visit http://localhost:5000/health to check if the API is running"
echo "3. Use the admin credentials to test the platform:"
echo "   Email: admin@kolabit.com"
echo "   Password: AdminPassword123!"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🚀"
