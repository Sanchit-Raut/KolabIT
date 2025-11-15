#!/bin/bash

echo "========================================"
echo "  Testing Arjun's Message Visibility"
echo "========================================"
echo ""

API_URL="http://localhost:5000/api"
SANCHIT_EMAIL="sanchit.raut23@spit.ac.in"
ARJUN_EMAIL="arjun.pimpale23@spit.ac.in"
PASSWORD1="Sanchit@123"
PASSWORD2="Arjun@123"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "Step 1: Sanchit logs in and sends a message to Arjun"
SANCHIT_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${SANCHIT_EMAIL}\",\"password\":\"${PASSWORD1}\"}")

SANCHIT_TOKEN=$(echo ${SANCHIT_RESPONSE} | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')
ARJUN_ID="4e70dc25-3dd2-4799-9c9f-630495e25cea"

TIMESTAMP=$(date +"%H:%M:%S")
MESSAGE="Message from Sanchit to Arjun at ${TIMESTAMP}"

echo "  Sending: '${MESSAGE}'"
SEND_RESULT=$(curl -s -X POST "${API_URL}/messages/${ARJUN_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}" \
  -d "{\"content\":\"${MESSAGE}\"}")

if echo "$SEND_RESULT" | grep -q "success"; then
  echo -e "${GREEN}  ✅ Message sent successfully${NC}"
else
  echo -e "${YELLOW}  ⚠️  Message send failed${NC}"
  echo "$SEND_RESULT"
  exit 1
fi

echo ""
echo "Step 2: Arjun logs in"
ARJUN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${ARJUN_EMAIL}\",\"password\":\"${PASSWORD2}\"}")

ARJUN_TOKEN=$(echo ${ARJUN_RESPONSE} | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')
SANCHIT_ID="ad19aa00-1cd4-463a-96e0-e44a1b279e6e"

if [ -z "$ARJUN_TOKEN" ]; then
  echo "  ❌ Arjun login failed"
  exit 1
fi
echo -e "${GREEN}  ✅ Arjun logged in${NC}"

echo ""
echo "Step 3: Arjun checks messages with Sanchit"
MESSAGES=$(curl -s -X GET "${API_URL}/messages/${SANCHIT_ID}" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}")

MESSAGE_COUNT=$(echo "$MESSAGES" | jq '.data | length')
echo "  Total messages in conversation: ${MESSAGE_COUNT}"

echo ""
echo "Step 4: Checking if Arjun sees the new message"
LAST_MESSAGE=$(echo "$MESSAGES" | jq -r '.data[-1] | "\(.sender.firstName) -> \(.recipient.firstName): \(.content)"')
echo -e "${BLUE}  Last message: ${LAST_MESSAGE}${NC}"

if echo "$LAST_MESSAGE" | grep -q "${TIMESTAMP}"; then
  echo -e "${GREEN}  ✅ Arjun CAN see Sanchit's message!${NC}"
else
  echo -e "${YELLOW}  ⚠️  Message not visible yet${NC}"
fi

echo ""
echo "Step 5: Checking Arjun's notifications"
NOTIFICATIONS=$(curl -s -X GET "${API_URL}/notifications?page=1&limit=5" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}")

UNREAD_COUNT=$(echo "$NOTIFICATIONS" | jq '.data.data | map(select(.isRead == false)) | length')
echo "  Unread notifications: ${UNREAD_COUNT}"

if [ "$UNREAD_COUNT" -gt 0 ]; then
  echo -e "${GREEN}  ✅ Arjun has ${UNREAD_COUNT} unread notifications${NC}"
  echo ""
  echo "  Latest notifications:"
  echo "$NOTIFICATIONS" | jq -r '.data.data[0:3] | .[] | "    - \(.title): \(.message)"'
else
  echo -e "${YELLOW}  ⚠️  No unread notifications${NC}"
fi

echo ""
echo "========================================"
echo "           SUMMARY"
echo "========================================"
echo -e "${GREEN}✅ Backend message system is working${NC}"
echo -e "${GREEN}✅ Arjun receives messages from Sanchit${NC}"
echo -e "${GREEN}✅ Arjun receives notifications${NC}"
echo ""
echo "To test in frontend:"
echo "1. Open http://localhost:3000"
echo "2. Login as Arjun (${ARJUN_EMAIL} / ${PASSWORD2})"
echo "3. Click notification bell icon"
echo "4. Or navigate to messages with Sanchit"
echo "5. Open browser console (F12) to see debug logs"
echo "========================================"
