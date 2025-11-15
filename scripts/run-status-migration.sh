#!/bin/bash

# Quick Database Status Update Script
# This script updates all PLANNING projects to RECRUITING status

echo "🔄 Updating project status from PLANNING to RECRUITING..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with DATABASE_URL"
    exit 1
fi

# Load DATABASE_URL from .env
export $(grep -v '^#' .env | grep DATABASE_URL | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not found in .env file"
    exit 1
fi

# Extract connection details from DATABASE_URL
# Format: postgresql://username:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "📊 Database: $DB_NAME"
echo "🖥️  Host: $DB_HOST:$DB_PORT"
echo "👤 User: $DB_USER"
echo ""

# Run the SQL update
echo "Running SQL update..."
PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/update-status.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Status update completed successfully!"
    echo "All projects with PLANNING status have been updated to RECRUITING"
else
    echo ""
    echo "❌ Update failed. Please check your database connection."
    exit 1
fi
