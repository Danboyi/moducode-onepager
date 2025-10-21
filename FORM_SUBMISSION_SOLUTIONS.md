# Form Submission Solutions

## Issues Identified
1. **SMTP Connection Timeout**: `ETIMEDOUT 216.198.79.1:465` - Your current SMTP server is not responding
2. **Missing Environment Configuration**: No `.env.local` file with SMTP settings
3. **Calendly Integration**: Modal should show after successful form submission

## Solutions Provided

### 1. Fixed SMTP Configuration (Immediate Fix)

**Create `.env.local` file in your project root:**

```env
# For Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
CONTACT_EMAIL=contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type
```

**For Gmail setup:**
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in `SMTP_PASS`

### 2. Alternative Email Services (Recommended)

#### Option A: Resend (Modern, Reliable)
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type
```

#### Option B: SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=false
EMAIL_FROM=your-verified-sender@yourdomain.com
CONTACT_EMAIL=contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type
```

### 3. Database Storage Solution (Most Reliable)

I've created `/api/contact-db` endpoint that:
- Stores form data in memory (for demo)
- No email dependencies
- Always works
- Can be extended to use real database

### 4. Improved Error Handling

The contact API now provides better error messages:
- Connection timeouts
- Authentication failures
- Missing configuration
- Rate limiting

### 5. Fixed Calendly Integration

- Added logging to debug Calendly modal
- Fallback message when Calendly link not configured
- Better error handling

## Testing Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test form submission:**
   ```bash
   node scripts/test-form-submission.js
   ```

3. **Test SMTP configuration:**
   ```bash
   node scripts/send_smtp_test.js
   ```

## Recommended Approach

### For Development/Testing:
Use the **database storage** approach (`/api/contact-db`) - it's reliable and doesn't require email configuration.

### For Production:
1. **Best**: Use **Resend** (modern, reliable, great deliverability)
2. **Alternative**: Use **SendGrid** or **Mailgun**
3. **Fallback**: Use **Gmail SMTP** (but less reliable for production)

## Quick Fix Steps

1. **Create `.env.local`** with your email configuration
2. **Update the form to use the database endpoint** (most reliable):
   ```typescript
   // In ContactForm.tsx, change the fetch URL:
   const res = await fetch('/api/contact-db', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   ```
3. **Test the form submission**
4. **Configure Calendly link** in environment variables

## Environment Variables Summary

```env
# Choose ONE email solution:

# Option 1: Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Option 2: Resend (Recommended)
RESEND_API_KEY=re_your_api_key_here

# Option 3: SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=false

# Common settings
EMAIL_FROM=your-email@yourdomain.com
CONTACT_EMAIL=contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type
```

## Next Steps

1. Choose your preferred email solution
2. Create the `.env.local` file with your configuration
3. Test the form submission
4. Configure your Calendly link
5. Deploy and test in production
