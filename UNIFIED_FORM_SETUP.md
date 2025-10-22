# Unified Form Submission Setup

## Overview
Your contact form now uses a unified endpoint (`/api/contact-unified`) that:
- ✅ Stores every submission in Vercel KV (Redis database)
- ✅ Sends email notifications via Resend
- ✅ Provides detailed success/failure feedback
- ✅ Includes rate limiting and error handling

## Environment Variables Setup

### 1. Vercel KV (Already configured)
Vercel KV is automatically configured when you deploy to Vercel. No additional setup needed.

### 2. Resend Email Setup
Create a `.env.local` file in your project root:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=contact@moducode.com

# Optional: Calendly Integration
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type
```

### 3. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create a new API key
3. Add it to your environment variables
4. Verify your domain in Resend dashboard

## How It Works

### Form Submission Flow
1. User submits form → `/api/contact-unified`
2. Rate limiting check (using KV)
3. Store submission in Vercel KV
4. Send email via Resend
5. Return success/failure status

### Data Storage
- **KV Storage**: Each submission gets a unique ID and timestamp
- **Email**: Formatted HTML email with all submission details
- **Logging**: Console logs for debugging and monitoring

### Error Handling
- If KV fails → continues with email
- If email fails → continues with KV storage
- If both fail → returns error to user
- Rate limiting prevents spam

## Testing

### Local Testing
```bash
# Start your development server
npm run dev

# In another terminal, run the test script
node scripts/test-unified-form.js
```

### Production Testing
1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Test form submission on live site
4. Check Vercel KV dashboard for stored submissions

## Monitoring

### View Stored Submissions
```bash
# GET endpoint to retrieve all submissions
curl https://your-domain.vercel.app/api/contact-unified
```

### Check Logs
- Vercel Function logs show detailed submission info
- Console logs include success/failure status for both KV and email

## Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check `RESEND_API_KEY` is set
   - Verify API key is valid

2. **"KV not available"**
   - Vercel KV should auto-configure
   - Check Vercel dashboard for KV setup

3. **Rate limit exceeded**
   - Normal behavior for spam protection
   - Wait 1 hour or test from different IP

### Debug Mode
The endpoint logs detailed information:
- ✅ KV storage success/failure
- ✅ Email sending success/failure
- 📝 Submission IDs and timestamps
- 🔍 Error details for troubleshooting

## Benefits

- **Reliability**: Dual storage (KV + email)
- **Performance**: Fast KV storage
- **Monitoring**: Detailed logging and status
- **Scalability**: Vercel KV handles high volume
- **Security**: Rate limiting and validation
