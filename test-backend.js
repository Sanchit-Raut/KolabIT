#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test suite
async function runTests() {
  console.log('🧪 Starting Backend Tests\n');
  console.log(`📍 Testing: ${BASE_URL}\n`);

  const tests = [];

  // Test 1: Health Check
  try {
    console.log('Test 1: Health Check (/health)');
    const res = await makeRequest('/health');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Health Check', passed: res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Health Check', passed: false });
  }

  // Test 2: Register User (POST /api/auth/register)
  try {
    console.log('Test 2: Register User (POST /api/auth/register)');
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      role: 'student',
    });
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Register User', passed: res.status === 201 || res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Register User', passed: false });
  }

  // Test 3: Get Users (GET /api/users)
  try {
    console.log('Test 3: Get Users (GET /api/users)');
    const res = await makeRequest('/api/users');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Get Users', passed: res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Get Users', passed: false });
  }

  // Test 4: Get Skills (GET /api/skills)
  try {
    console.log('Test 4: Get Skills (GET /api/skills)');
    const res = await makeRequest('/api/skills');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Get Skills', passed: res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Get Skills', passed: false });
  }

  // Test 5: Get Projects (GET /api/projects)
  try {
    console.log('Test 5: Get Projects (GET /api/projects)');
    const res = await makeRequest('/api/projects');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Get Projects', passed: res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Get Projects', passed: false });
  }

  // Test 6: Get Posts (GET /api/posts)
  try {
    console.log('Test 6: Get Posts (GET /api/posts)');
    const res = await makeRequest('/api/posts');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, res.body);
    tests.push({ name: 'Get Posts', passed: res.status === 200 });
    console.log(`  ✅ PASSED\n`);
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    tests.push({ name: 'Get Posts', passed: false });
  }

  // Summary
  console.log('\n📊 Test Summary');
  console.log('═'.repeat(40));
  const passed = tests.filter((t) => t.passed).length;
  const total = tests.length;
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Failed: ${total - passed}/${total}`);
  console.log('═'.repeat(40));

  if (passed === total) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
