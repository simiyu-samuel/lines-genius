const https = require('https');

// Test Hugging Face API key and models
function testHuggingFace() {
  console.log('Testing Hugging Face API...\n');

  // Test with different models
  const models = ['gpt2', 'distilgpt2', 'microsoft/DialoGPT-small'];
  
  models.forEach((model, index) => {
    setTimeout(() => {
      testModel(model);
    }, index * 2000);
  });
}

function testModel(model) {
  console.log(`Testing model: ${model}`);
  
  const postData = JSON.stringify({
    inputs: "Hello world",
    parameters: {
      max_length: 20,
      temperature: 0.8,
      do_sample: true
    }
  });

  const options = {
    hostname: 'api-inference.huggingface.co',
    port: 443,
    path: `/models/${model}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`  Status: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log(`  ✅ Model ${model} is accessible`);
          if (Array.isArray(response) && response.length > 0) {
            console.log(`  Sample output: "${response[0].generated_text}"`);
          }
        } catch (e) {
          console.log(`  ⚠️  Model ${model} responded but with unexpected format`);
        }
      } else if (res.statusCode === 401) {
        console.log(`  ❌ Model ${model}: Unauthorized - Check API key`);
      } else if (res.statusCode === 404) {
        console.log(`  ❌ Model ${model}: Not found`);
      } else {
        console.log(`  ❌ Model ${model}: Error ${res.statusCode}`);
      }
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.log(`  ❌ Model ${model}: Network error - ${error.message}`);
    console.log('');
  });

  req.write(postData);
  req.end();
}

// Test without API key first
console.log('1. Testing without API key (should fail with 401):');
testHuggingFace();

// Instructions
setTimeout(() => {
  console.log('\n=== INSTRUCTIONS ===');
  console.log('1. If you see "Unauthorized" errors, you need to set HUGGINGFACE_API_KEY');
  console.log('2. Go to https://huggingface.co/settings/tokens');
  console.log('3. Create a new token with "read" permissions');
  console.log('4. Add it to your Vercel backend environment variables');
  console.log('5. Set HUGGINGFACE_MODEL=gpt2 in Vercel');
  console.log('\nIf models show "Not found", try different models like:');
  console.log('- gpt2');
  console.log('- distilgpt2');
  console.log('- microsoft/DialoGPT-small');
}, 10000); 