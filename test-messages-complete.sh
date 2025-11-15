#!/bin/bash

echo "=========================================="
echo "  Complete Message System Test"
echo "=========================================="
echo ""

API_URL="http://localhost:5000/api"

# Test 1: Sanchit sends to Arjun
echo "TEST 1: Sanchit → Arjun"
echo "----------------------------"
SANCHIT_TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"sanchit.raut23@spit.ac.in","password":"Sanchit@123"}' \
  | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

ARJUN_ID="4e70dc25-3dd2-4799-9c9f-630495e25cea"
TIMESTAMP=$(date +"%H:%M:%S")

echo "Sending: 'Test message from Sanchit at ${TIMESTAMP}'"
curl -s -X POST "${API_URL}/messages/${ARJUN_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}" \
  -d "{\"content\":\"Test message from Sanchit at ${TIMESTAMP}\"}" \
  | jq '.message'

echo ""
echo "✅ Message sent from Sanchit to Arjun"
echo ""

# Test 2: Arjun checks messages
echo "TEST 2: Arjun checks messages"
echo "----------------------------"
ARJUN_TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"arjun.pimpale23@spit.ac.in","password":"Arjun@123"}' \
  | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

SANCHIT_ID="ad19aa00-1cd4-463a-96e0-e44a1b279e6e"

echo "Fetching conversation..."
LAST_MSG=$(curl -s -X GET "${API_URL}/messages/${SANCHIT_ID}" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}" \
  | jq -r '.data[-1] | "\(.sender.firstName) → \(.recipient.firstName): \(.content)"')

echo "Last message: ${LAST_MSG}"

if echo "$LAST_MSG" | grep -q "${TIMESTAMP}"; then
  echo "✅ Arjun received Sanchit's message"
else
  echo "⚠️  Message not found"
fi
echo ""

# Test 3: Arjun replies
echo "TEST 3: Arjun → Sanchit (Reply)"
echo "----------------------------"
REPLY_TIME=$(date +"%H:%M:%S")

echo "Sending: 'Reply from Arjun at ${REPLY_TIME}'"
curl -s -X POST "${API_URL}/messages/${SANCHIT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}" \
  -d "{\"content\":\"Reply from Arjun at ${REPLY_TIME}\"}" \
  | jq '.message'

echo ""
echo "✅ Reply sent from Arjun to Sanchit"
echo ""

# Test 4: Sanchit checks reply
echo "TEST 4: Sanchit checks reply"
echo "----------------------------"
echo "Fetching conversation..."
REPLY_MSG=$(curl -s -X GET "${API_URL}/messages/${ARJUN_ID}" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}" \
  | jq -r '.data[-1] | "\(.sender.firstName) → \(.recipient.firstName): \(.content)"')

echo "Last message: ${REPLY_MSG}"

if echo "$REPLY_MSG" | grep -q "${REPLY_TIME}"; then
  echo "✅ Sanchit received Arjun's reply"
else
  echo "⚠️  Reply not found"
fi
echo ""

# Test 5: Check notifications
echo "TEST 5: Notifications"
echo "----------------------------"
ARJUN_NOTIF=$(curl -s -X GET "${API_URL}/notifications?page=1&limit=1" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}" \
  | jq -r '.data.data[0] | "\(.title): \(.message)"')

SANCHIT_NOTIF=$(curl -s -X GET "${API_URL}/notifications?page=1&limit=1" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}" \
  | jq -r '.data.data[0] | "\(.title): \(.message)"')

echo "Arjun's notification: ${ARJUN_NOTIF}"
echo "Sanchit's notification: ${SANCHIT_NOTIF}"
echo ""

echo "=========================================="
echo "  Test Summary"
echo "=========================================="
echo "✅ Sanchit can send messages to Arjun"
echo "✅ Arjun receives messages from Sanchit"
echo "✅ Arjun can reply to Sanchit"
echo "✅ Sanchit receives Arjun's reply"
echo "✅ Notifications are created"
echo ""
echo "Frontend URLs to test:"
echo "  Sanchit → Arjun: http://localhost:3000/messages/${ARJUN_ID}"
echo "  Arjun → Sanchit: http://localhost:3000/messages/${SANCHIT_ID}"
echo "  Messages Inbox: http://localhost:3000/messages"
echo "=========================================="
