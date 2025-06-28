const https = require('https');

// Test login functionality
function testLogin() {
  console.log('Testing Login Endpoint...\n');

  const loginData = JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = https.request(options, (res) => {
    console.log('Login Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Login Response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data?.token) {
          console.log('✅ Login successful! Token received.');
          // Test getting current user with the token
          testGetCurrentUser(response.data.token);
        } else {
          console.log('❌ Login failed or no token received.');
        }
      } catch (e) {
        console.log('Raw Response:', data);
        console.log('❌ Failed to parse JSON response.');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Login request failed:', error.message);
  });

  req.write(loginData);
  req.end();
}

function testGetCurrentUser(token) {
  console.log('\nTesting Get Current User...\n');

  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Get Current User Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Get Current User Response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data?.user) {
          console.log('✅ Get current user successful!');
        } else {
          console.log('❌ Get current user failed.');
        }
      } catch (e) {
        console.log('Raw Response:', data);
        console.log('❌ Failed to parse JSON response.');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Get current user request failed:', error.message);
  });

  req.end();
}

// Test registration first
function testRegister() {
  console.log('Testing Registration Endpoint...\n');

  const registerData = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };

  const req = https.request(options, (res) => {
    console.log('Register Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Register Response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('✅ Registration successful!');
          // Now test login
          setTimeout(testLogin, 1000);
        } else {
          console.log('❌ Registration failed or user already exists.');
          // Try login anyway
          setTimeout(testLogin, 1000);
        }
      } catch (e) {
        console.log('Raw Response:', data);
        console.log('❌ Failed to parse JSON response.');
        // Try login anyway
        setTimeout(testLogin, 1000);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Registration request failed:', error.message);
    // Try login anyway
    setTimeout(testLogin, 1000);
  });

  req.write(registerData);
  req.end();
}

console.log('Testing Authentication System...\n');
testRegister(); 