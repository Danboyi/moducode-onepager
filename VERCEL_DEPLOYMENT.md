# Vercel Deployment Guide

## Quick Setup Steps

### 1. **Deploy to Vercel**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy your project
vercel

# Or push to GitHub and connect to Vercel dashboard
```

### 2. **Configure Environment Variables**

Go to your Vercel project → **Settings** → **Environment Variables**

#### **Option A: Gmail SMTP (Quick Setup)**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
SMTP_SECURE = false
EMAIL_FROM = your-email@gmail.com
CONTACT_EMAIL = contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK = https://calendly.com/your-username/meeting-type
```

#### **Option B: Resend (Recommended)**
```
RESEND_API_KEY = re_your_api_key_here
EMAIL_FROM = noreply@yourdomain.com
CONTACT_EMAIL = contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK = https://calendly.com/your-username/meeting-type
```

#### **Option C: Vercel KV (For Persistent Storage)**
```
KV_REST_API_URL = your-kv-url
KV_REST_API_TOKEN = your-kv-token
KV_REST_API_READ_ONLY_TOKEN = your-readonly-token
```

### 3. **Enable Vercel KV (Optional but Recommended)**

1. Go to your Vercel project dashboard
2. Click on **Storage** tab
3. Create a new **KV Database**
4. Copy the environment variables to your project

### 4. **Update Form to Use KV Storage**

Change your form to use the KV endpoint for persistent storage:

```typescript
// In ContactForm.tsx, update the fetch URL:
const res = await fetch('/api/contact-kv', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

## Production Recommendations

### **Best Setup for Production:**

1. **Email Service**: Use **Resend** (most reliable)
2. **Storage**: Use **Vercel KV** for persistent form data
3. **Fallback**: Keep database endpoint as backup

### **Environment Variables for Production:**

```env
# Email Service (choose one)
RESEND_API_KEY=re_your_api_key_here
# OR
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=false

# Common
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=contact@moducode.com
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-username/meeting-type

# Storage (optional)
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
```

## Testing Your Deployment

### 1. **Test Form Submission**
Visit your deployed site and submit the form.

### 2. **Check Logs**
```bash
vercel logs your-project-name
```

### 3. **Test API Endpoints**
```bash
# Test database endpoint
curl -X POST https://your-domain.vercel.app/api/contact-db \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John","lastName":"Doe","message":"Test message"}'

# Test KV endpoint (if configured)
curl -X POST https://your-domain.vercel.app/api/contact-kv \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John","lastName":"Doe","message":"Test message"}'
```

## Troubleshooting

### **Common Issues:**

1. **"Email service not configured"**
   - Check environment variables are set correctly
   - Ensure they're set for the correct environment (Production/Preview)

2. **"Rate limit exceeded"**
   - This is working correctly - prevents spam
   - Wait 1 hour or test from different IP

3. **"Missing required fields"**
   - Check form validation
   - Ensure all required fields are filled

4. **Calendly modal not showing**
   - Check `NEXT_PUBLIC_CALENDLY_LINK` is set
   - Verify the Calendly URL is correct

### **Debug Steps:**

1. Check Vercel function logs
2. Test API endpoints individually
3. Verify environment variables
4. Check network requests in browser dev tools

## Monitoring

### **View Form Submissions:**

```bash
# If using KV storage
curl https://your-domain.vercel.app/api/contact-kv

# If using database storage
curl https://your-domain.vercel.app/api/contact-db
```

### **Set up Monitoring:**

1. **Vercel Analytics**: Enable in dashboard
2. **Error Tracking**: Consider Sentry
3. **Email Monitoring**: Check email delivery rates

## Security Notes

1. **Never commit environment variables** to git
2. **Use app passwords** for Gmail (not regular passwords)
3. **Rate limiting** is enabled to prevent spam
4. **Input validation** is implemented
5. **HTTPS** is automatically enabled on Vercel

## Next Steps

1. Deploy to Vercel
2. Configure environment variables
3. Test form submission
4. Set up monitoring
5. Configure your domain (optional)
