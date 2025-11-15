#!/bin/bash

echo "=========================================="
echo "  KolabIT Chat System Complete Test"
echo "=========================================="
echo ""

API_URL="http://localhost:5000/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Step 1: Testing Backend Connection..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/health 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "000" ]; then
    echo -e "${RED}❌ Backend is not responding on port 5000${NC}"
    echo "Please start the backend first: npm run dev"
    exit 1
else
    echo -e "${GREEN}✅ Backend is running (HTTP ${HEALTH_CHECK})${NC}"
fi
echo ""

echo "Step 2: Login as Sanchit..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"sanchit.raut23@spit.ac.in","password":"Sanchit@123"}')

echo "Login Response: ${LOGIN_RESPONSE}"

SANCHIT_TOKEN=$(echo ${LOGIN_RESPONSE} | grep -o '"token":"[^"]*"' | head -1 | sed 's/"token":"//;s/"//')

if [ -z "$SANCHIT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to login as Sanchit${NC}"
    echo "Response: ${LOGIN_RESPONSE}"
    exit 1
fi

echo -e "${GREEN}✅ Sanchit logged in${NC}"
echo "Token: ${SANCHIT_TOKEN:0:30}..."
echo ""

echo "Step 3: Login as Arjun..."
ARJUN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"arjun.pimpale23@spit.ac.in","password":"Arjun@123"}')

echo "Login Response: ${ARJUN_RESPONSE}"

ARJUN_TOKEN=$(echo ${ARJUN_RESPONSE} | grep -o '"token":"[^"]*"' | head -1 | sed 's/"token":"//;s/"//')
ARJUN_ID=$(echo ${ARJUN_RESPONSE} | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')

if [ -z "$ARJUN_TOKEN" ]; then
    echo -e "${RED}❌ Failed to login as Arjun${NC}"
    echo "Response: ${ARJUN_RESPONSE}"
    exit 1
fi

echo -e "${GREEN}✅ Arjun logged in${NC}"
echo "Token: ${ARJUN_TOKEN:0:30}..."
echo "User ID: ${ARJUN_ID}"
echo ""

echo "Step 4: Sanchit sending message to Arjun..."
echo "Endpoint: POST ${API_URL}/messages/${ARJUN_ID}"
echo "Content: Hello Arjun! Testing the chat system."

SEND_RESPONSE=$(curl -s -X POST "${API_URL}/messages/${ARJUN_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}" \
  -d '{"content":"Hello Arjun! Testing the chat system."}' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$SEND_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$SEND_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status: ${HTTP_CODE}"
echo "Response: ${RESPONSE_BODY}"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ Message sent successfully!${NC}"
else
    echo -e "${RED}❌ Failed to send message (HTTP ${HTTP_CODE})${NC}"
fi
echo ""

echo "Step 5: Arjun checking messages..."
SANCHIT_ID=$(echo ${LOGIN_RESPONSE} | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')

GET_RESPONSE=$(curl -s -X GET "${API_URL}/messages/${SANCHIT_ID}" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}" \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$GET_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status: ${HTTP_CODE}"
echo "Messages: ${RESPONSE_BODY}"

if echo "$RESPONSE_BODY" | grep -q "Testing the chat system"; then
    echo -e "${GREEN}✅ Message received by Arjun!${NC}"
else
    echo -e "${YELLOW}⚠️  Message not found in conversation${NC}"
fi
echo ""

echo "Step 6: Arjun replying..."
REPLY_RESPONSE=$(curl -s -X POST "${API_URL}/messages/${SANCHIT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARJUN_TOKEN}" \
  -d '{"content":"Hi Sanchit! I got your message. Chat is working!"}' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$REPLY_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$REPLY_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status: ${HTTP_CODE}"
echo "Response: ${RESPONSE_BODY}"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ Reply sent successfully!${NC}"
else
    echo -e "${RED}❌ Failed to send reply (HTTP ${HTTP_CODE})${NC}"
fi
echo ""

echo "Step 7: Checking notifications for Sanchit..."
NOTIF_RESPONSE=$(curl -s -X GET "${API_URL}/notifications?page=1&limit=10" \
  -H "Authorization: Bearer ${SANCHIT_TOKEN}")

echo "Notifications: ${NOTIF_RESPONSE}"

if echo "$NOTIF_RESPONSE" | grep -q "message"; then
    echo -e "${GREEN}✅ Notification created!${NC}"
else
    echo -e "${YELLOW}⚠️  No message notification found${NC}"
fi
echo ""

echo "=========================================="
echo "           TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}Backend:${NC} Running on port 5000"
echo -e "${GREEN}Frontend:${NC} Should be on port 3000 or 3001"
echo ""
echo "Test Users:"
echo "  - Sanchit: sanchit.raut23@spit.ac.in"
echo "  - Arjun: arjun.pimpale23@spit.ac.in"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:3001 (or 3000)"
echo "2. Login as one of the test users"
echo "3. Navigate to a project and click 'Message Lead'"
echo "4. Open browser DevTools (F12) -> Console"
echo "5. Try sending a message and check the logs"
echo ""
echo "=========================================="
