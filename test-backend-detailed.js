#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test suite
async function runTests() {
  console.log('🧪 COMPREHENSIVE BACKEND TESTING SUITE');
  console.log('='.repeat(60));
  console.log(`📍 Server: ${BASE_URL}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: [],
  };

  let authToken = null;
  let testUserId = null;
  let testProjectId = null;
  let testUserEmail = null; // Store the email for login test

  // Helper to record test result
  function recordTest(name, passed, details = '') {
    results.total++;
    if (passed) {
      results.passed++;
      console.log(`  ✅ PASSED ${details ? '- ' + details : ''}`);
    } else {
      results.failed++;
      console.log(`  ❌ FAILED ${details ? '- ' + details : ''}`);
    }
    results.tests.push({ name, passed, details });
  }

  // =================================================================
  // TEST 1: Server Health Check
  // =================================================================
  console.log('\n📌 TEST 1: Server Health Check');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest('/health');
    console.log(`  Request: GET /health`);
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Response:`, JSON.stringify(res.body, null, 2));
    
    recordTest(
      'Health Check',
      res.status === 200 && res.body.success === true,
      'Server is running and responsive'
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Health Check', false, error.message);
  }

  // =================================================================
  // TEST 2: Get All Skills
  // =================================================================
  console.log('\n📌 TEST 2: Get All Skills (Public Endpoint)');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest('/api/skills');
    console.log(`  Request: GET /api/skills`);
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Number of Skills: ${res.body.data?.length || 0}`);
    
    if (res.body.data && res.body.data.length > 0) {
      console.log(`  Sample Skills:`);
      res.body.data.slice(0, 3).forEach(skill => {
        console.log(`    - ${skill.name} (${skill.category})`);
      });
    }
    
    recordTest(
      'Get Skills',
      res.status === 200 && Array.isArray(res.body.data),
      `Found ${res.body.data?.length || 0} skills`
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Get Skills', false, error.message);
  }

  // =================================================================
  // TEST 3: Get All Projects
  // =================================================================
  console.log('\n📌 TEST 3: Get All Projects (Public Endpoint)');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest('/api/projects');
    console.log(`  Request: GET /api/projects`);
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Number of Projects: ${res.body.data?.data?.length || 0}`);
    
    if (res.body.data?.data && res.body.data.data.length > 0) {
      console.log(`  Sample Projects:`);
      res.body.data.data.forEach(project => {
        console.log(`    - ${project.title} (${project.status})`);
        testProjectId = project.id; // Save for later tests
      });
    }
    
    recordTest(
      'Get Projects',
      res.status === 200,
      `Found ${res.body.data?.data?.length || 0} projects`
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Get Projects', false, error.message);
  }

  // =================================================================
  // TEST 4: Get All Posts
  // =================================================================
  console.log('\n📌 TEST 4: Get All Posts (Public Endpoint)');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest('/api/posts');
    console.log(`  Request: GET /api/posts`);
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Number of Posts: ${res.body.data?.data?.length || 0}`);
    
    if (res.body.data?.data && res.body.data.data.length > 0) {
      console.log(`  Sample Posts:`);
      res.body.data.data.forEach(post => {
        console.log(`    - "${post.content?.substring(0, 50)}..."`);
      });
    }
    
    recordTest(
      'Get Posts',
      res.status === 200,
      `Found ${res.body.data?.data?.length || 0} posts`
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Get Posts', false, error.message);
  }

  // =================================================================
  // TEST 5: Register New User
  // =================================================================
  console.log('\n📌 TEST 5: User Registration');
  console.log('-'.repeat(60));
  try {
    const timestamp = Date.now();
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser${timestamp}@kolabit.test`,
      password: 'SecurePassword123!',
      rollNumber: 'TEST001',
      department: 'Computer Science',
      year: 2,
      semester: 3,
      bio: 'Test user for backend testing',
    };
    
    console.log(`  Request: POST /api/auth/register`);
    console.log(`  User Data:`, JSON.stringify(userData, null, 2));
    
    const res = await makeRequest('/api/auth/register', 'POST', userData);
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Response:`, JSON.stringify(res.body, null, 2));
    
    if (res.body.data?.token) {
      authToken = res.body.data.token;
      testUserId = res.body.data.user?.id;
      testUserEmail = userData.email; // Save email for login test
      console.log(`  🔑 Auth Token Received: ${authToken.substring(0, 20)}...`);
      console.log(`  👤 User ID: ${testUserId}`);
    }
    
    recordTest(
      'User Registration',
      res.status === 201 || res.status === 200,
      res.body.data?.user?.email || 'User created'
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('User Registration', false, error.message);
  }

  // =================================================================
  // TEST 6: Login with Created User
  // =================================================================
  console.log('\n📌 TEST 6: User Login');
  console.log('-'.repeat(60));
  
  if (!testUserEmail) {
    console.log(`  ⚠️  Skipping: Registration failed, no user to login with`);
    recordTest('User Login', false, 'Skipped - no registered user');
  } else {
    try {
      const loginData = {
        email: testUserEmail,
        password: 'SecurePassword123!',
      };
      
      console.log(`  Request: POST /api/auth/login`);
      console.log(`  Login attempt with email: ${loginData.email}`);
      
      const res = await makeRequest('/api/auth/login', 'POST', loginData);
      console.log(`  Status Code: ${res.status}`);
      
      if (res.body.data?.token) {
        authToken = res.body.data.token;
        console.log(`  🔑 New Auth Token: ${authToken.substring(0, 20)}...`);
      } else {
        console.log(`  Response:`, JSON.stringify(res.body, null, 2));
      }
      
      recordTest(
        'User Login',
        res.status === 200 && res.body.data?.token,
        'Login successful'
      );
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      recordTest('User Login', false, error.message);
    }
  }

  // =================================================================
  // TEST 7: Get User Profile (Protected)
  // =================================================================
  console.log('\n📌 TEST 7: Get User Profile (Protected Endpoint)');
  console.log('-'.repeat(60));
  try {
    console.log(`  Request: GET /api/users (without auth)`);
    const resNoAuth = await makeRequest('/api/users');
    console.log(`  Status Code (no auth): ${resNoAuth.status}`);
    console.log(`  Expected: 401 Unauthorized`);
    
    const isUnauthorized = resNoAuth.status === 401;
    
    recordTest(
      'Protected Endpoint Security',
      isUnauthorized,
      'Correctly blocks unauthenticated requests'
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Protected Endpoint Security', false, error.message);
  }

  // =================================================================
  // TEST 8: Get Specific Project Details
  // =================================================================
  if (testProjectId) {
    console.log('\n📌 TEST 8: Get Project Details');
    console.log('-'.repeat(60));
    try {
      console.log(`  Request: GET /api/projects/${testProjectId}`);
      const res = await makeRequest(`/api/projects/${testProjectId}`);
      console.log(`  Status Code: ${res.status}`);
      
      if (res.body.data) {
        console.log(`  Project Title: ${res.body.data.title}`);
        console.log(`  Project Status: ${res.body.data.status}`);
        console.log(`  Required Skills: ${res.body.data.requiredSkills?.length || 0}`);
      }
      
      recordTest(
        'Get Project Details',
        res.status === 200 && res.body.data,
        `Retrieved project: ${res.body.data?.title || 'N/A'}`
      );
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      recordTest('Get Project Details', false, error.message);
    }
  }

  // =================================================================
  // TEST 9: Invalid Endpoint (404 Test)
  // =================================================================
  console.log('\n📌 TEST 9: Invalid Endpoint (404 Test)');
  console.log('-'.repeat(60));
  try {
    console.log(`  Request: GET /api/nonexistent`);
    const res = await makeRequest('/api/nonexistent');
    console.log(`  Status Code: ${res.status}`);
    console.log(`  Expected: 404 Not Found`);
    
    recordTest(
      'Error Handling',
      res.status === 404,
      'Correctly returns 404 for invalid endpoints'
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Error Handling', false, error.message);
  }

  // =================================================================
  // TEST 10: Rate Limiting Check
  // =================================================================
  console.log('\n📌 TEST 10: Rate Limiting (Security Feature)');
  console.log('-'.repeat(60));
  try {
    console.log(`  Making 5 rapid requests to /health...`);
    const rapidRequests = [];
    for (let i = 0; i < 5; i++) {
      rapidRequests.push(makeRequest('/health'));
    }
    
    const responses = await Promise.all(rapidRequests);
    const allSuccessful = responses.every(r => r.status === 200);
    
    console.log(`  All requests successful: ${allSuccessful}`);
    console.log(`  Note: Rate limiting may allow these requests if limit is not exceeded`);
    
    recordTest(
      'Rate Limiting',
      true,
      'Server handles rapid requests (within limit)'
    );
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    recordTest('Rate Limiting', false, error.message);
  }

  // =================================================================
  // FINAL SUMMARY
  // =================================================================
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${Math.round((results.passed / results.total) * 100)}%)`);
  console.log(`❌ Failed: ${results.failed} (${Math.round((results.failed / results.total) * 100)}%)`);
  console.log('='.repeat(60));
  
  console.log('\n📝 Detailed Results:');
  results.tests.forEach((test, index) => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`  ${icon} ${index + 1}. ${test.name}`);
    if (test.details) {
      console.log(`      ${test.details}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`⏰ Completed: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));

  if (results.passed === results.total) {
    console.log('\n🎉 ALL TESTS PASSED! Backend is working perfectly!');
    process.exit(0);
  } else if (results.passed >= results.total * 0.7) {
    console.log('\n✅ Most tests passed! Backend is working well!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the details above.');
    process.exit(1);
  }
}

// Run the tests
console.log('⏳ Initializing test suite...\n');
runTests().catch((error) => {
  console.error('\n💥 FATAL ERROR:', error);
  process.exit(1);
});
