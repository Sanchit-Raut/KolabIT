const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;
const API_BASE = '/api';

// Use the token from registration
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhsenEzaHYwMDAwdTR5azBnaWRzNHhpIiwiZW1haWwiOiJuZXd0ZXN0dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYyMzQ2NzA0LCJleHAiOjE3NjI5NTE1MDR9.Ue_nB0BZ3dTLLKV5ahIvsYBpzM5RCN4CTXb13Mky-y0';
const userId = 'cmhlzq3hv0000u4yk0gids4xi';

let certificationId = null;
let portfolioId = null;
let portfolio2Id = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `${API_BASE}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body,
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test results
const results = [];

function logTest(testName, passed, message = '') {
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${testName}${message ? ': ' + message : ''}`);
  results.push({ test: testName, passed, message });
}

async function runTests() {
  console.log('\n🧪 Testing New Features (Certification, Portfolio, Analytics)\n');
  console.log('='.repeat(70));
  console.log(`Using auth token for user: ${userId}\n`);

  try {
    // 1. Certification Tests
    console.log('\n📜 Certification Tests\n');
    
    // Create certification
    const certData = {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024-01-15',
      imageUrl: 'https://example.com/aws-cert.png'
    };
    const createCertRes = await makeRequest('POST', '/certifications', certData, authToken);
    if (createCertRes.status === 201 && createCertRes.data.data.id) {
      certificationId = createCertRes.data.data.id;
      logTest('Create Certification', true, `ID: ${certificationId}`);
    } else {
      logTest('Create Certification', false, `Status: ${createCertRes.status}, ${JSON.stringify(createCertRes.data)}`);
    }

    // Get my certifications
    const getMyCertsRes = await makeRequest('GET', '/certifications/my', null, authToken);
    if (getMyCertsRes.status === 200 && Array.isArray(getMyCertsRes.data.data)) {
      logTest('Get My Certifications', true, `Found ${getMyCertsRes.data.data.length} certification(s)`);
    } else {
      logTest('Get My Certifications', false, `Status: ${getMyCertsRes.status}`);
    }

    // Get certification by ID
    if (certificationId) {
      const getCertRes = await makeRequest('GET', `/certifications/${certificationId}`, null, authToken);
      if (getCertRes.status === 200 && getCertRes.data.data.id === certificationId) {
        logTest('Get Certification by ID', true, `Name: ${getCertRes.data.data.name}`);
      } else {
        logTest('Get Certification by ID', false, `Status: ${getCertRes.status}`);
      }

      // Update certification
      const updateCertData = {
        name: 'AWS Certified Solutions Architect - Professional',
        issuer: 'Amazon Web Services'
      };
      const updateCertRes = await makeRequest('PUT', `/certifications/${certificationId}`, updateCertData, authToken);
      if (updateCertRes.status === 200 && updateCertRes.data.data.name === updateCertData.name) {
        logTest('Update Certification', true, `Updated name`);
      } else {
        logTest('Update Certification', false, `Status: ${updateCertRes.status}`);
      }
    }

    // Get user certifications (public)
    const getUserCertsRes = await makeRequest('GET', `/certifications/user/${userId}`, null, null);
    if (getUserCertsRes.status === 200 && Array.isArray(getUserCertsRes.data.data)) {
      logTest('Get User Certifications (Public)', true, `Found ${getUserCertsRes.data.data.length} certification(s)`);
    } else {
      logTest('Get User Certifications (Public)', false, `Status: ${getUserCertsRes.status}`);
    }

    // 2. Portfolio Tests
    console.log('\n🎨 Portfolio Tests\n');
    
    // Create portfolio item
    const portfolioData = {
      title: 'E-Commerce Platform',
      link: 'https://github.com/user/ecommerce',
      description: 'Full-stack e-commerce platform with React and Node.js',
      imageUrl: 'https://example.com/ecommerce-preview.png',
      order: 0
    };
    const createPortfolioRes = await makeRequest('POST', '/portfolios', portfolioData, authToken);
    if (createPortfolioRes.status === 201 && createPortfolioRes.data.data.id) {
      portfolioId = createPortfolioRes.data.data.id;
      logTest('Create Portfolio Item', true, `ID: ${portfolioId}`);
    } else {
      logTest('Create Portfolio Item', false, `Status: ${createPortfolioRes.status}, ${JSON.stringify(createPortfolioRes.data)}`);
    }

    // Create second portfolio item
    const portfolio2Data = {
      title: 'Chat Application',
      link: 'https://github.com/user/chat-app',
      description: 'Real-time chat application using Socket.IO',
      imageUrl: 'https://example.com/chat-preview.png',
      order: 1
    };
    const createPortfolio2Res = await makeRequest('POST', '/portfolios', portfolio2Data, authToken);
    if (createPortfolio2Res.status === 201 && createPortfolio2Res.data.data.id) {
      portfolio2Id = createPortfolio2Res.data.data.id;
      logTest('Create Second Portfolio Item', true, `ID: ${portfolio2Id}`);
    } else {
      logTest('Create Second Portfolio Item', false, `Status: ${createPortfolio2Res.status}`);
    }

    // Get my portfolios
    const getMyPortfoliosRes = await makeRequest('GET', '/portfolios/my', null, authToken);
    if (getMyPortfoliosRes.status === 200 && Array.isArray(getMyPortfoliosRes.data.data)) {
      logTest('Get My Portfolio Items', true, `Found ${getMyPortfoliosRes.data.data.length} item(s)`);
    } else {
      logTest('Get My Portfolio Items', false, `Status: ${getMyPortfoliosRes.status}`);
    }

    // Get portfolio by ID
    if (portfolioId) {
      const getPortfolioRes = await makeRequest('GET', `/portfolios/${portfolioId}`, null, authToken);
      if (getPortfolioRes.status === 200 && getPortfolioRes.data.data.id === portfolioId) {
        logTest('Get Portfolio by ID', true, `Title: ${getPortfolioRes.data.data.title}`);
      } else {
        logTest('Get Portfolio by ID', false, `Status: ${getPortfolioRes.status}`);
      }

      // Update portfolio
      const updatePortfolioData = {
        title: 'E-Commerce Platform v2.0',
        description: 'Enhanced e-commerce platform with AI recommendations'
      };
      const updatePortfolioRes = await makeRequest('PUT', `/portfolios/${portfolioId}`, updatePortfolioData, authToken);
      if (updatePortfolioRes.status === 200 && updatePortfolioRes.data.data.title === updatePortfolioData.title) {
        logTest('Update Portfolio Item', true, `Updated title`);
      } else {
        logTest('Update Portfolio Item', false, `Status: ${updatePortfolioRes.status}`);
      }
    }

    // Reorder portfolios
    if (portfolioId && portfolio2Id) {
      const reorderData = {
        itemIds: [portfolio2Id, portfolioId] // Swap order
      };
      const reorderRes = await makeRequest('PUT', '/portfolios/reorder', reorderData, authToken);
      if (reorderRes.status === 200) {
        logTest('Reorder Portfolio Items', true, 'Order updated');
      } else {
        logTest('Reorder Portfolio Items', false, `Status: ${reorderRes.status}`);
      }
    }

    // Get user portfolios (public)
    const getUserPortfoliosRes = await makeRequest('GET', `/portfolios/user/${userId}`, null, null);
    if (getUserPortfoliosRes.status === 200 && Array.isArray(getUserPortfoliosRes.data.data)) {
      logTest('Get User Portfolio Items (Public)', true, `Found ${getUserPortfoliosRes.data.data.length} item(s)`);
    } else {
      logTest('Get User Portfolio Items (Public)', false, `Status: ${getUserPortfoliosRes.status}`);
    }

    // 3. Analytics Tests
    console.log('\n📊 Analytics Tests\n');
    
    // Get my analytics
    const getMyAnalyticsRes = await makeRequest('GET', '/analytics/my', null, authToken);
    if (getMyAnalyticsRes.status === 200 && getMyAnalyticsRes.data.data) {
      logTest('Get My Analytics', true, `Profile views: ${getMyAnalyticsRes.data.data.profileViews || 0}`);
    } else {
      logTest('Get My Analytics', false, `Status: ${getMyAnalyticsRes.status}`);
    }

    // Get my analytics report
    const getMyReportRes = await makeRequest('GET', '/analytics/my/report', null, authToken);
    if (getMyReportRes.status === 200 && getMyReportRes.data.data) {
      logTest('Get My Analytics Report', true, `Projects: ${getMyReportRes.data.data.projectsCreated || 0}, Posts: ${getMyReportRes.data.data.postsCreated || 0}, Skills: ${getMyReportRes.data.data.skillsListed || 0}`);
    } else {
      logTest('Get My Analytics Report', false, `Status: ${getMyReportRes.status}`);
    }

    // Get my engagement score
    const getMyEngagementRes = await makeRequest('GET', '/analytics/my/engagement', null, authToken);
    if (getMyEngagementRes.status === 200 && getMyEngagementRes.data.data) {
      logTest('Get My Engagement Score', true, `Score: ${getMyEngagementRes.data.data.score || 0}`);
    } else {
      logTest('Get My Engagement Score', false, `Status: ${getMyEngagementRes.status}`);
    }

    // Get user analytics (public - increments view count)
    const getUserAnalyticsRes = await makeRequest('GET', `/analytics/user/${userId}`, null, null);
    if (getUserAnalyticsRes.status === 200 && getUserAnalyticsRes.data.data) {
      logTest('Get User Analytics (Public)', true, `Profile views: ${getUserAnalyticsRes.data.data.profileViews}`);
    } else {
      logTest('Get User Analytics (Public)', false, `Status: ${getUserAnalyticsRes.status}`);
    }

    // Verify view count incremented
    const getMyAnalytics2Res = await makeRequest('GET', '/analytics/my', null, authToken);
    if (getMyAnalytics2Res.status === 200 && getMyAnalytics2Res.data.data) {
      const viewCount = getMyAnalytics2Res.data.data.profileViews;
      logTest('Profile View Count Incremented', viewCount > 0, `Now at: ${viewCount}`);
    } else {
      logTest('Profile View Count Incremented', false, `Status: ${getMyAnalytics2Res.status}`);
    }

    // 4. Cleanup - Delete created items
    console.log('\n🧹 Cleanup Tests\n');
    
    // Delete certification
    if (certificationId) {
      const deleteCertRes = await makeRequest('DELETE', `/certifications/${certificationId}`, null, authToken);
      if (deleteCertRes.status === 200) {
        logTest('Delete Certification', true, 'Deleted successfully');
      } else {
        logTest('Delete Certification', false, `Status: ${deleteCertRes.status}`);
      }
    }

    // Delete portfolio items
    if (portfolioId) {
      const deletePortfolioRes = await makeRequest('DELETE', `/portfolios/${portfolioId}`, null, authToken);
      if (deletePortfolioRes.status === 200) {
        logTest('Delete Portfolio Item 1', true, 'Deleted successfully');
      } else {
        logTest('Delete Portfolio Item 1', false, `Status: ${deletePortfolioRes.status}`);
      }
    }

    if (portfolio2Id) {
      const deletePortfolio2Res = await makeRequest('DELETE', `/portfolios/${portfolio2Id}`, null, authToken);
      if (deletePortfolio2Res.status === 200) {
        logTest('Delete Portfolio Item 2', true, 'Deleted successfully');
      } else {
        logTest('Delete Portfolio Item 2', false, `Status: ${deletePortfolio2Res.status}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Test error:', error);
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Summary\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`Total Tests: ${total}`);
  console.log(`\x1b[32m✓ Passed: ${passed}\x1b[0m`);
  console.log(`\x1b[31m✗ Failed: ${failed}\x1b[0m`);
  console.log(`Pass Rate: ${passRate}%\n`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:\n');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  • ${r.test}${r.message ? ': ' + r.message : ''}`);
    });
    console.log();
  }
}

// Run tests
runTests().catch(console.error);
