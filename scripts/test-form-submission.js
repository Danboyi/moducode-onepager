// Test script for form submission
// Run with: node scripts/test-form-submission.js

const testFormSubmission = async () => {
  const testData = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    jobTitle: 'CTO',
    country: 'US',
    phone: '+1234567890',
    message: 'This is a test message from the form submission test script.'
  };

  console.log('Testing form submission with data:', testData);

  try {
    // Test the original SMTP endpoint
    console.log('\n--- Testing SMTP endpoint ---');
    const smtpResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const smtpResult = await smtpResponse.json();
    console.log('SMTP Response status:', smtpResponse.status);
    console.log('SMTP Response:', smtpResult);

    // Test the database endpoint
    console.log('\n--- Testing Database endpoint ---');
    const dbResponse = await fetch('http://localhost:3000/api/contact-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const dbResult = await dbResponse.json();
    console.log('DB Response status:', dbResponse.status);
    console.log('DB Response:', dbResult);

    // Test the Resend endpoint (if configured)
    console.log('\n--- Testing Resend endpoint ---');
    const resendResponse = await fetch('http://localhost:3000/api/contact-resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    const resendResult = await resendResponse.json();
    console.log('Resend Response status:', resendResponse.status);
    console.log('Resend Response:', resendResult);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testFormSubmission();
