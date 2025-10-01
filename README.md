This is Moducode's one pager landing page for requesting talents and demo

## Environment variables for contact form

To enable the server-side contact form email delivery, set the following environment variables in your deployment or local .env:

- SMTP_HOST - SMTP server host (e.g. smtp.sendgrid.net)
- SMTP_PORT - SMTP server port (e.g. 587)
- SMTP_USER - SMTP username
- SMTP_PASS - SMTP password
- SMTP_SECURE - "true" if using a secure connection (SSL/TLS), otherwise "false"
- EMAIL_FROM - (optional) From address to use for outgoing emails. Defaults to the submitter's email.
- CONTACT_EMAIL - (optional) Destination address. Defaults to contact@moducode.com

Example .env:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=yourpassword
SMTP_SECURE=false
EMAIL_FROM=no-reply@moducode.com
CONTACT_EMAIL=contact@moducode.com

# Optional
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/YOUR-CALENDLY-LINK/30min

## Optional analytics forwarding (server-side)

If you'd like the app to forward form-submit events to Google Analytics (Measurement Protocol / GA4), set these env vars:

- GA_MEASUREMENT_ID=G-XXXXXXXXXX
- GA_API_SECRET=YOUR_API_SECRET

The app exposes a server endpoint at `/api/analytics` which accepts POST { name, params } and will forward to GA4 when the above vars are set.
```

