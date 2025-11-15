#!/bin/bash

# Test Message System
echo "========================================"
echo " KolabIT Message System Test"
echo "========================================"
echo ""

# User IDs
USER1_ID="ad19aa00-1cd4-463a-96e0-e44a1b279e6e"  # Sanchit
USER2_ID="4e70dc25-3dd2-4799-9c9f-630495e25cea"  # Arjun
USER1_EMAIL="sanchit.raut23@spit.ac.in"
USER2_EMAIL="arjun.pimpale23@spit.ac.in"
PASSWORD="password123"
API_URL="http://localhost:5000/api"

echo "Test Users:"
echo "  1. Sanchit (${USER1_EMAIL})"
echo "  2. Arjun (${USER2_EMAIL})"
echo ""

# Login as User 1
echo "1. Logging in as Sanchit..."
USER1_TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${USER1_EMAIL}\",\"password\":\"${PASSWORD}\"}" \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER1_TOKEN" ]; then
  echo "❌ Failed to login as Sanchit"
  exit 1
fi
echo "✅ Logged in as Sanchit"
echo ""

# Login as User 2
echo "2. Logging in as Arjun..."
USER2_TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${USER2_EMAIL}\",\"password\":\"${PASSWORD}\"}" \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER2_TOKEN" ]; then
  echo "❌ Failed to login as Arjun"
  exit 1
fi
echo "✅ Logged in as Arjun"
echo ""

# Send message from User 1 to User 2
echo "3. Sanchit sending message to Arjun..."
SEND_RESPONSE=$(curl -s -X POST "${API_URL}/messages/${USER2_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER1_TOKEN}" \
  -d '{"content":"Hello Arjun! This is a test message from the script."}')

echo "Response: ${SEND_RESPONSE}"

if echo "$SEND_RESPONSE" | grep -q "success"; then
  echo "✅ Message sent successfully"
else
  echo "❌ Failed to send message"
  echo "Error: ${SEND_RESPONSE}"
fi
echo ""

# Fetch messages as User 2
echo "4. Arjun checking messages..."
MESSAGES=$(curl -s -X GET "${API_URL}/messages/${USER1_ID}" \
  -H "Authorization: Bearer ${USER2_TOKEN}")

echo "Messages: ${MESSAGES}"

if echo "$MESSAGES" | grep -q "test message"; then
  echo "✅ Message received by Arjun"
else
  echo "⚠️  Message might not have been received"
fi
echo ""

# Send reply from User 2 to User 1
echo "5. Arjun replying to Sanchit..."
REPLY_RESPONSE=$(curl -s -X POST "${API_URL}/messages/${USER1_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER2_TOKEN}" \
  -d '{"content":"Hi Sanchit! I received your message. Testing reply."}')

echo "Response: ${REPLY_RESPONSE}"

if echo "$REPLY_RESPONSE" | grep -q "success"; then
  echo "✅ Reply sent successfully"
else
  echo "❌ Failed to send reply"
fi
echo ""

# Check notifications for User 1
echo "6. Checking Sanchit's notifications..."
NOTIFICATIONS=$(curl -s -X GET "${API_URL}/notifications?page=1&limit=10" \
  -H "Authorization: Bearer ${USER1_TOKEN}")

if echo "$NOTIFICATIONS" | grep -q "New message"; then
  echo "✅ Notification created for Sanchit"
else
  echo "⚠️  No notification found"
fi
echo ""

echo "========================================"
echo " Test Complete"
echo "========================================"
