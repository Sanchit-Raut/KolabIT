#!/bin/bash

# Email System Test Script
# Tests the complete email verification and password reset flow

echo "🧪 Testing KolabIT Email System..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
API_URL="http://localhost:5000/api"

# Test email (change this to your email for testing)
TEST_EMAIL="test@example.com"
TEST_PASSWORD="TestPassword123"
TEST_FIRSTNAME="Test"
TEST_LASTNAME="User"

echo "📧 Using test email: $TEST_EMAIL"
echo ""

# Test 1: Register User
echo "Test 1: Register User"
echo "---------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'",
    "firstName": "'"$TEST_FIRSTNAME"'",
    "lastName": "'"$TEST_LASTNAME"'"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  echo "   Check your email for verification link!"
else
  echo -e "${RED}❌ Registration failed${NC}"
  echo "   Response: $REGISTER_RESPONSE"
fi
echo ""

# Test 2: Try to login before verification
echo "Test 2: Try to Login (Before Verification)"
echo "-------------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "verify your email"; then
  echo -e "${GREEN}✅ Correctly blocked unverified user${NC}"
else
  echo -e "${YELLOW}⚠️  Login response: $LOGIN_RESPONSE${NC}"
fi
echo ""

# Test 3: Resend Verification Email
echo "Test 3: Resend Verification Email"
echo "----------------------------------"
RESEND_RESPONSE=$(curl -s -X POST "$API_URL/auth/resend-verification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'"
  }')

if echo "$RESEND_RESPONSE" | grep -q "success.*true"; then
  echo -e "${GREEN}✅ Verification email resent${NC}"
else
  echo -e "${RED}❌ Failed to resend${NC}"
  echo "   Response: $RESEND_RESPONSE"
fi
echo ""

# Test 4: Request Password Reset
echo "Test 4: Request Password Reset"
echo "-------------------------------"
RESET_REQUEST=$(curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'"
  }')

if echo "$RESET_REQUEST" | grep -q "success.*true"; then
  echo -e "${GREEN}✅ Password reset email sent${NC}"
else
  echo -e "${RED}❌ Failed to send reset email${NC}"
  echo "   Response: $RESET_REQUEST"
fi
echo ""

echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo ""
echo -e "${YELLOW}📧 Email Tests:${NC}"
echo "1. Check your inbox for verification email"
echo "2. Check for resent verification email"
echo "3. Check for password reset email"
echo ""
echo -e "${YELLOW}🔧 Manual Steps:${NC}"
echo "1. Click verification link in email"
echo "2. Try logging in after verification"
echo "3. Test password reset flow"
echo ""
echo -e "${GREEN}✨ Email system test complete!${NC}"
