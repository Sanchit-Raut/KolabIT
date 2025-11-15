#!/bin/bash

# KolabIT Database Quick Setup Script
# This script helps you set up the PostgreSQL database for KolabIT

echo "🗄️  KolabIT Database Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL status...${NC}"
if sudo systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting it...${NC}"
    sudo systemctl start postgresql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
        exit 1
    fi
fi

echo ""
echo "Choose your database setup option:"
echo ""
echo "1) Create new database with dedicated user (Recommended)"
echo "   Database: kolabit_dev"
echo "   User: kolabit_user"
echo "   Password: kolabit_password"
echo ""
echo "2) Use default postgres user (Quick setup)"
echo "   Database: kolabit"
echo "   User: postgres"
echo ""
echo "3) Check current database status"
echo ""
echo "4) Update PLANNING status to RECRUITING"
echo ""
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Creating dedicated database and user...${NC}"
        echo ""
        
        # Create database and user
        sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'kolabit_user') THEN
      CREATE USER kolabit_user WITH PASSWORD 'kolabit_password';
      RAISE NOTICE 'User kolabit_user created';
   ELSE
      RAISE NOTICE 'User kolabit_user already exists';
   END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE kolabit_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kolabit_dev')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kolabit_dev TO kolabit_user;

-- Connect and grant schema privileges
\c kolabit_dev
GRANT ALL ON SCHEMA public TO kolabit_user;
ALTER DATABASE kolabit_dev OWNER TO kolabit_user;

\echo ''
\echo '✅ Database setup completed!'
\echo ''
EOF

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database and user created successfully${NC}"
            echo ""
            echo -e "${YELLOW}Update your .env file with:${NC}"
            echo 'DATABASE_URL="postgresql://kolabit_user:kolabit_password@localhost:5432/kolabit_dev?schema=public"'
            echo ""
            
            # Ask if user wants to update .env
            read -p "Do you want to automatically update .env file? (y/n): " update_env
            if [ "$update_env" = "y" ] || [ "$update_env" = "Y" ]; then
                # Update .env file
                if [ -f .env ]; then
                    sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://kolabit_user:kolabit_password@localhost:5432/kolabit_dev?schema=public"|' .env
                    echo -e "${GREEN}✅ .env file updated${NC}"
                else
                    echo -e "${YELLOW}⚠️  .env file not found. Please create it manually.${NC}"
                fi
            fi
            
            # Ask if user wants to initialize database
            echo ""
            read -p "Do you want to initialize the database schema now? (y/n): " init_db
            if [ "$init_db" = "y" ] || [ "$init_db" = "Y" ]; then
                echo ""
                echo -e "${BLUE}Initializing database schema...${NC}"
                npm run db:push
                
                if [ $? -eq 0 ]; then
                    echo ""
                    read -p "Do you want to seed initial data? (y/n): " seed_db
                    if [ "$seed_db" = "y" ] || [ "$seed_db" = "Y" ]; then
                        npm run db:setup
                    fi
                fi
            fi
        else
            echo -e "${RED}❌ Failed to create database${NC}"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo -e "${BLUE}Setting up with default postgres user...${NC}"
        echo ""
        
        # Create database with postgres user
        sudo -u postgres psql << EOF
-- Create database if not exists
SELECT 'CREATE DATABASE kolabit'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kolabit')\gexec

\echo ''
\echo '✅ Database setup completed!'
\echo ''
EOF

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database created successfully${NC}"
            echo ""
            echo -e "${YELLOW}Update your .env file with:${NC}"
            echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kolabit?schema=public"'
            echo ""
            
            # Ask if user wants to update .env
            read -p "Do you want to automatically update .env file? (y/n): " update_env
            if [ "$update_env" = "y" ] || [ "$update_env" = "Y" ]; then
                if [ -f .env ]; then
                    sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kolabit?schema=public"|' .env
                    echo -e "${GREEN}✅ .env file updated${NC}"
                else
                    echo -e "${YELLOW}⚠️  .env file not found. Please create it manually.${NC}"
                fi
            fi
            
            # Ask if user wants to initialize database
            echo ""
            read -p "Do you want to initialize the database schema now? (y/n): " init_db
            if [ "$init_db" = "y" ] || [ "$init_db" = "Y" ]; then
                echo ""
                echo -e "${BLUE}Initializing database schema...${NC}"
                npm run db:push
                
                if [ $? -eq 0 ]; then
                    echo ""
                    read -p "Do you want to seed initial data? (y/n): " seed_db
                    if [ "$seed_db" = "y" ] || [ "$seed_db" = "Y" ]; then
                        npm run db:setup
                    fi
                fi
            fi
        else
            echo -e "${RED}❌ Failed to create database${NC}"
            exit 1
        fi
        ;;
    
    3)
        echo ""
        echo -e "${BLUE}Checking database status...${NC}"
        echo ""
        
        # List databases
        echo -e "${YELLOW}Available databases:${NC}"
        sudo -u postgres psql -c "\l" | grep kolabit
        
        echo ""
        echo -e "${YELLOW}PostgreSQL users:${NC}"
        sudo -u postgres psql -c "\du" | grep kolabit
        
        echo ""
        echo -e "${YELLOW}Current DATABASE_URL in .env:${NC}"
        if [ -f .env ]; then
            grep "^DATABASE_URL=" .env
        else
            echo ".env file not found"
        fi
        ;;
    
    4)
        echo ""
        echo -e "${BLUE}Updating project status from PLANNING to RECRUITING...${NC}"
        echo ""
        
        # Get database name from .env
        if [ -f .env ]; then
            DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"')
            DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
            DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
            
            echo "Database: $DB_NAME"
            echo "User: $DB_USER"
            echo ""
            
            if [ "$DB_USER" = "postgres" ]; then
                sudo -u postgres psql -d $DB_NAME -c "UPDATE projects SET status = 'RECRUITING' WHERE status = 'PLANNING';"
            else
                psql -U $DB_USER -d $DB_NAME -h localhost -c "UPDATE projects SET status = 'RECRUITING' WHERE status = 'PLANNING';"
            fi
            
            if [ $? -eq 0 ]; then
                echo ""
                echo -e "${GREEN}✅ Status updated successfully${NC}"
                
                # Show updated projects
                echo ""
                echo -e "${YELLOW}Updated projects:${NC}"
                if [ "$DB_USER" = "postgres" ]; then
                    sudo -u postgres psql -d $DB_NAME -c "SELECT id, title, status FROM projects;"
                else
                    psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT id, title, status FROM projects;"
                fi
            else
                echo -e "${RED}❌ Failed to update status${NC}"
            fi
        else
            echo -e "${RED}❌ .env file not found${NC}"
        fi
        ;;
    
    5)
        echo "Exiting..."
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Make sure .env file has correct DATABASE_URL"
echo "2. Run: npm run dev (to start backend)"
echo "3. Run: cd Frontend && npm run dev (to start frontend)"
echo ""
