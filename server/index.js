import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HOSTINGER_API_BASE = 'https://api.mail.hostinger.com';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const requiredEnvVars = [
  'HOSTINGER_API_TOKEN',
  'HOSTINGER_MAILBOX_RESOURCE_ID',
];

function checkEnvVars() {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `[server] Missing required environment variables: ${missing.join(', ')}`
    );
    return false;
  }
  return true;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/send-email', async (req, res) => {
  if (!checkEnvVars()) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error. Missing required environment variables.',
    });
  }

  const { name, email, address, residentialBusiness, message } = req.body || {};

  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required.';
  } else if (name.length > 200) {
    errors.name = 'Name is too long.';
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  } else if (email.length > 320) {
    errors.email = 'Email is too long.';
  }

  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.address = 'Address is required.';
  } else if (address.length > 500) {
    errors.address = 'Address is too long.';
  }

  if (!residentialBusiness || typeof residentialBusiness !== 'string') {
    errors.residentialBusiness = 'Please select Residential or Business.';
  } else if (!['Residential', 'Business'].includes(residentialBusiness)) {
    errors.residentialBusiness = 'Invalid selection for Residential/Business.';
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message is required.';
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  } else if (message.length > 10000) {
    errors.message = 'Message is too long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      error: 'Validation failed.',
      errors,
    });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'webrequest@duradata.co.za';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'webadmin@duradata.co.za';
  const displayName = process.env.CONTACT_FROM_NAME || 'DuraData Website';
  const mailboxResourceId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID;

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeAddress = escapeHtml(address.trim());
  const safeResBiz = escapeHtml(residentialBusiness);
  const safeMessage = escapeHtml(message.trim());

  const subject = `New Contact Form Submission - ${safeName}`;

  const textBody = `
New Contact Form Submission
===========================

Name: ${name.trim()}
Email: ${email.trim()}
Address: ${address.trim()}
Residential/Business: ${residentialBusiness}

Message:
--------
${message.trim()}
--------

Sent via DuraData website contact form.
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(90deg, #1e3a8a, #0e7490); color: #fff; padding: 20px 28px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
    .content { padding: 24px 28px; }
    .row { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
    .row:last-of-type { border-bottom: none; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #64748b; margin-bottom: 6px; }
    .value { font-size: 15px; color: #0f172a; word-wrap: break-word; }
    .value a { color: #0e7490; text-decoration: none; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-residential { background: #dbeafe; color: #1d4ed8; }
    .badge-business { background: #ccfbf1; color: #0f766e; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .footer { text-align: center; padding: 16px 28px; font-size: 12px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>DuraData Website</p>
    </div>
    <div class="content">
      <div class="row">
        <div class="label">Full Name</div>
        <div class="value">${safeName}</div>
      </div>
      <div class="row">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
      </div>
      <div class="row">
        <div class="label">Physical Address</div>
        <div class="value">${safeAddress}</div>
      </div>
      <div class="row">
        <div class="label">Category</div>
        <div class="value">
          <span class="badge ${safeResBiz === 'Residential' ? 'badge-residential' : 'badge-business'}">${safeResBiz}</span>
        </div>
      </div>
      <div class="row">
        <div class="label">Message</div>
        <div class="message-box">${safeMessage}</div>
      </div>
    </div>
    <div class="footer">
      This email was sent from the DuraData website contact form.
    </div>
  </div>
</body>
</html>
  `.trim();

  const payload = {
    to: [toEmail],
    displayName,
    subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    const response = await fetch(
      `${HOSTINGER_API_BASE}/api/v1/mailboxes/${encodeURIComponent(mailboxResourceId)}/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HOSTINGER_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errorDetail = errJson.error;
        }
        if (errJson && errJson.code) {
          errorDetail += ` [${errJson.code}]`;
        }
      } catch {
        // ignore parse error
      }
      console.error(`[server] Hostinger API error: ${errorDetail}`);
      return res.status(502).json({
        success: false,
        error: 'Failed to send email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (err) {
    console.error(`[server] Network error sending email:`, err.message || err);
    return res.status(502).json({
      success: false,
      error: 'Failed to send email. Please check your network connection and try again.',
    });
  }
});

app.get('/api/health', (_req, res) => {
  const envOk = requiredEnvVars.every((v) => process.env[v]);
  res.status(200).json({
    status: 'ok',
    envConfigured: envOk,
    fromEmail: process.env.CONTACT_FROM_EMAIL || 'webadmin@duradata.co.za',
    toEmail: process.env.CONTACT_TO_EMAIL || 'webrequest@duradata.co.za',
  });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] DuraData server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[server] API health check: http://localhost:${PORT}/api/health`);
  }
  checkEnvVars();
});
