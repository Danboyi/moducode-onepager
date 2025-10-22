/**
 * Test script for the unified contact form endpoint
 * This tests both KV storage and email sending functionality
 */

const testSubmission = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Test Company',
  jobTitle: 'CTO',
  country: 'United States',
  phone: '+1 (555) 123-4567',
  message: 'This is a test submission to verify the unified endpoint works correctly.'
};

async function testUnifiedEndpoint() {
  console.log('🧪 Testing unified contact form endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/contact-unified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSubmission),
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Test PASSED!');
      console.log('📝 Submission ID:', result.id);
      console.log('💾 KV Storage:', result.kvSuccess ? '✅ Success' : '❌ Failed');
      console.log('📧 Email Sent:', result.emailSuccess ? '✅ Success' : '❌ Failed');
    } else {
      console.log('\n❌ Test FAILED!');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test ERROR:', error.message);
  }
}

// Run the test
testUnifiedEndpoint();
