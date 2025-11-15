#!/bin/bash

echo "=========================================="
echo "  Testing Session Persistence"
echo "=========================================="
echo ""

# Login and get token
echo "1. Logging in as Sanchit..."
RESPONSE=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"sanchit.raut23@spit.ac.in","password":"Sanchit@123"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Verify token works
echo "2. Verifying token by fetching profile..."
PROFILE=$(curl -s -X GET "http://localhost:5000/api/auth/profile" \
  -H "Authorization: Bearer ${TOKEN}")

NAME=$(echo $PROFILE | grep -o '"firstName":"[^"]*"' | sed 's/"firstName":"//;s/"//')

if [ -z "$NAME" ]; then
  echo "❌ Token verification failed"
  exit 1
fi

echo "✅ Token valid - User: ${NAME}"
echo ""

echo "3. Simulating page refresh (re-fetching profile with same token)..."
sleep 1
PROFILE2=$(curl -s -X GET "http://localhost:5000/api/auth/profile" \
  -H "Authorization: Bearer ${TOKEN}")

NAME2=$(echo $PROFILE2 | grep -o '"firstName":"[^"]*"' | sed 's/"firstName":"//;s/"//')

if [ "$NAME" = "$NAME2" ]; then
  echo "✅ Session persisted after refresh - User: ${NAME2}"
else
  echo "❌ Session lost after refresh"
  exit 1
fi
echo ""

echo "=========================================="
echo "  Summary"
echo "=========================================="
echo "✅ Login works"
echo "✅ Token persists"
echo "✅ Profile can be fetched multiple times"
echo ""
echo "In the browser:"
echo "1. Login should work once"
echo "2. Refresh the page"
echo "3. You should STAY logged in"
echo "4. No need to login again!"
echo "=========================================="
