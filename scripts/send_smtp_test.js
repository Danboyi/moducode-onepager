const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1);
    // remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found at', envPath);
    process.exit(1);
  }
  const env = parseEnvFile(envPath);

  const host = env.SMTP_HOST;
  const port = parseInt(env.SMTP_PORT || '587', 10);
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const secure = (env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const from = env.EMAIL_FROM;
  const to = env.CONTACT_EMAIL;

  if (!host || !port || !user || !pass) {
    console.error('Missing SMTP configuration in .env.local');
    process.exit(1);
  }

  console.log('SMTP config:', { host, port, user: user.replace(/.(?=.{2}$)/g, '*'), secure });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  try {
    const info = await transporter.sendMail({
      from: from || user,
      to: to || user,
      subject: 'SMTP Test from moducode-onepager',
      text: 'This is a test message sent from the local SMTP test script.',
    });
    console.log('Message sent:', info && info.messageId ? info.messageId : info);
    console.log('Full response:', info);
  } catch (err) {
    console.error('Send failed:', err && err.message ? err.message : err);
    if (err && err.response) console.error('Response:', err.response);
    process.exit(2);
  }
}

main();
