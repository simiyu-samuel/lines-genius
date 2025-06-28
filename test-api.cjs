const https = require('https');

// Test the health endpoint
function testHealth() {
  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Health Check Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Health Check Response:', JSON.parse(data));
    });
  });

  req.on('error', (error) => {
    console.error('Health Check Error:', error);
  });

  req.end();
}

// Test the AI test endpoint
function testAI() {
  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/api/lines/test-ai',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log('AI Test Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('AI Test Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Raw Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('AI Test Error:', error);
  });

  req.end();
}

// Test the lines generation endpoint
function testGenerate() {
  const postData = JSON.stringify({
    category: 'taglines',
    tone: 'corporate',
    count: 2
  });

  const options = {
    hostname: 'lines-genius-backend.vercel.app',
    port: 443,
    path: '/api/lines/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log('Generate Lines Status:', res.statusCode);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Generate Lines Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Raw Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Generate Lines Error:', error);
  });

  req.write(postData);
  req.end();
}

console.log('Testing Backend API...\n');

console.log('1. Testing Health Endpoint:');
testHealth();

setTimeout(() => {
  console.log('\n2. Testing AI Services:');
  testAI();
}, 2000);

setTimeout(() => {
  console.log('\n3. Testing Lines Generation:');
  testGenerate();
}, 4000); 