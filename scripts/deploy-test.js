// Test script for Vercel deployment
// Run with: node scripts/deploy-test.js

const testDeployment = async () => {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  console.log(`Testing deployment at: ${baseUrl}`);

  const testData = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    jobTitle: 'CTO',
    country: 'US',
    phone: '+1234567890',
    message: 'This is a test message from the deployment test script.'
  };

  try {
    // Test database endpoint
    console.log('\n--- Testing Database endpoint ---');
    const dbResponse = await fetch(`${baseUrl}/api/contact-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const dbResult = await dbResponse.json();
    console.log('DB Response status:', dbResponse.status);
    console.log('DB Response:', dbResult);

    // Test KV endpoint (if available)
    console.log('\n--- Testing KV endpoint ---');
    const kvResponse = await fetch(`${baseUrl}/api/contact-kv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const kvResult = await kvResponse.json();
    console.log('KV Response status:', kvResponse.status);
    console.log('KV Response:', kvResult);

    // Test SMTP endpoint (if configured)
    console.log('\n--- Testing SMTP endpoint ---');
    const smtpResponse = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const smtpResult = await smtpResponse.json();
    console.log('SMTP Response status:', smtpResponse.status);
    console.log('SMTP Response:', smtpResult);

    // Test Resend endpoint (if configured)
    console.log('\n--- Testing Resend endpoint ---');
    const resendResponse = await fetch(`${baseUrl}/api/contact-resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const resendResult = await resendResponse.json();
    console.log('Resend Response status:', resendResponse.status);
    console.log('Resend Response:', resendResult);

    console.log('\n✅ All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Database endpoint:', dbResponse.ok ? '✅ Working' : '❌ Failed');
    console.log('- KV endpoint:', kvResponse.ok ? '✅ Working' : '❌ Failed');
    console.log('- SMTP endpoint:', smtpResponse.ok ? '✅ Working' : '❌ Failed');
    console.log('- Resend endpoint:', resendResponse.ok ? '✅ Working' : '❌ Failed');

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testDeployment();
