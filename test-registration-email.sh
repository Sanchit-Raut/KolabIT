#!/bin/bash

echo "🧪 Testing Email System"
echo "======================"
echo ""

# Test email configuration
echo "📧 Checking email configuration..."
echo "Email From: kyu.chahiye23@gmail.com"
echo "Email Service Key: qbbl goin xcrf xttr"
echo ""

# Register a test user
echo "1️⃣ Registering a test user..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "kyu.chahiye23@gmail.com",
    "password": "Test1234!"
  }')

echo "Response: $RESPONSE"
echo ""

# Wait a bit
echo "⏳ Waiting 3 seconds for email to send..."
sleep 3

echo ""
echo "✅ Check your email inbox: kyu.chahiye23@gmail.com"
echo "💡 Also check spam/junk folder"
echo ""
echo "📋 Backend logs should show email sending details"
echo "Run: tail -f backend.log"
