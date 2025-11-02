const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  rollNumber: 'CS001',
  department: 'Computer Science',
  year: 3,
  semester: 5
};

async function testAuthentication() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('Test 1: Health Check');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('Test 2: User Registration');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('✅ Registration successful');
      console.log('User ID:', registerResponse.data.data.user.id);
      console.log('Token generated:', !!registerResponse.data.data.token);
      console.log('');
      
      const token = registerResponse.data.data.token;
      
      // Test 3: Get Profile (Protected Route)
      console.log('Test 3: Get Profile (Protected Route)');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile access successful');
      console.log('User email:', profileResponse.data.data.email);
      console.log('');

      // Test 4: Update Profile
      console.log('Test 4: Update Profile');
      const updateData = {
        bio: 'Computer Science student passionate about web development',
        year: 4
      };
      const updateResponse = await axios.put(`${BASE_URL}/api/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile update successful');
      console.log('Updated bio:', updateResponse.data.data.bio);
      console.log('Updated year:', updateResponse.data.data.year);
      console.log('');

      // Test 5: Login with same credentials
      console.log('Test 5: Login Test');
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful');
      console.log('New token generated:', !!loginResponse.data.data.token);
      console.log('');

      // Test 6: Invalid Login
      console.log('Test 6: Invalid Login Test');
      try {
        await axios.post(`${BASE_URL}/api/auth/login`, {
          email: testUser.email,
          password: 'wrongpassword'
        });
        console.log('❌ Invalid login should have failed');
      } catch (error) {
        console.log('✅ Invalid login correctly rejected');
        console.log('Error message:', error.response.data.error.message);
      }
      console.log('');

      // Test 7: Access without token
      console.log('Test 7: Access without token');
      try {
        await axios.get(`${BASE_URL}/api/auth/profile`);
        console.log('❌ Unauthorized access should have failed');
      } catch (error) {
        console.log('✅ Unauthorized access correctly rejected');
        console.log('Status:', error.response.status);
        console.log('Error message:', error.response.data.error.message);
      }
      console.log('');

      console.log('🎉 All authentication tests passed!');

    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('Make sure the server is running on port 5000');
  }
}

// Run the tests
testAuthentication().catch(console.error);
