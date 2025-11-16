#!/bin/bash

echo "🧪 Testing KolabIT Registration Email Flow"
echo "=========================================="
echo ""

# Delete existing test user if exists
echo "1️⃣ Cleaning up old test user..."
psql -U postgres -d kolabit -c "DELETE FROM users WHERE email = 'testuser$(date +%s)@gmail.com';" 2>/dev/null

# Generate unique email
TEST_EMAIL="testuser$(date +%s)@test.com"
echo "📧 Test email: $TEST_EMAIL"
echo ""

# Register new user
echo "2️⃣ Registering new user..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"Test1234!@#\"
  }")

echo "Response: $RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success.*true"; then
  echo "✅ Registration successful!"
  echo ""
  echo "📧 Check backend logs for email sending details"
  echo "💡 Look for lines with: 📤 [EmailUtils]"
else
  echo "❌ Registration failed!"
  echo "Error: $RESPONSE"
fi

echo ""
echo "=========================================="
echo "Backend logs command: tail -f backend-output.log"
