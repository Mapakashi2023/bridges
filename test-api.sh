#!/bin/bash

# Bridges LMS API Test Script
# This script tests all the main API endpoints

API_URL="http://localhost:8888/api"
TOKEN=""

echo "🚀 Bridges LMS API Test Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
curl -s "$API_URL/health" | jq '.'
echo ""

# Test 2: Admin Login
echo -e "${BLUE}Test 2: Admin Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "WorldAdmin",
    "password": "World@2026"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
else
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi
echo ""

# Test 3: Get Profile
echo -e "${BLUE}Test 3: Get User Profile${NC}"
curl -s "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 4: Get Admin Dashboard
echo -e "${BLUE}Test 4: Get Admin Dashboard${NC}"
curl -s "$API_URL/dashboard/admin" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 5: Create a Teacher
echo -e "${BLUE}Test 5: Create Teacher User${NC}"
TEACHER_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "email": "teacher1@bridges.edu",
    "password": "teacher123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "teacher",
    "phone": "+1234567890"
  }')

echo "$TEACHER_RESPONSE" | jq '.'
TEACHER_ID=$(echo "$TEACHER_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}✓ Teacher created with ID: $TEACHER_ID${NC}"
echo ""

# Test 6: Create a Student
echo -e "${BLUE}Test 6: Create Student User${NC}"
STUDENT_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@bridges.edu",
    "password": "student123",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "student",
    "phone": "+1234567891"
  }')

echo "$STUDENT_RESPONSE" | jq '.'
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}✓ Student created with ID: $STUDENT_ID${NC}"
echo ""

# Test 7: Create a Course
echo -e "${BLUE}Test 7: Create Course${NC}"
COURSE_RESPONSE=$(curl -s -X POST "$API_URL/courses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Introduction to Programming\",
    \"description\": \"Learn the basics of programming with Python\",
    \"course_code\": \"CS101\",
    \"instructor_id\": $TEACHER_ID,
    \"category\": \"Computer Science\",
    \"level\": \"beginner\",
    \"duration_weeks\": 12,
    \"credits\": 3,
    \"status\": \"published\"
  }")

echo "$COURSE_RESPONSE" | jq '.'
COURSE_ID=$(echo "$COURSE_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}✓ Course created with ID: $COURSE_ID${NC}"
echo ""

# Test 8: Get All Courses
echo -e "${BLUE}Test 8: Get All Courses${NC}"
curl -s "$API_URL/courses" | jq '.'
echo ""

# Test 9: Enroll Student in Course
echo -e "${BLUE}Test 9: Enroll Student in Course${NC}"
ENROLLMENT_RESPONSE=$(curl -s -X POST "$API_URL/enrollments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"student_id\": $STUDENT_ID,
    \"course_id\": $COURSE_ID
  }")

echo "$ENROLLMENT_RESPONSE" | jq '.'
ENROLLMENT_ID=$(echo "$ENROLLMENT_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}✓ Student enrolled with enrollment ID: $ENROLLMENT_ID${NC}"
echo ""

# Test 10: Get Course Enrollments
echo -e "${BLUE}Test 10: Get Course Enrollments${NC}"
curl -s "$API_URL/enrollments/course/$COURSE_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 11: Get All Users
echo -e "${BLUE}Test 11: Get All Users${NC}"
curl -s "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 12: Updated Dashboard with New Data
echo -e "${BLUE}Test 12: Get Updated Admin Dashboard${NC}"
curl -s "$API_URL/dashboard/admin" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo -e "${GREEN}================================${NC}"
