import 'dotenv/config';

const token = process.env.HOSTINGER_API_TOKEN;
if (!token) {
  console.error('HOSTINGER_API_TOKEN is not set in .env');
  process.exit(1);
}

try {
  const res = await fetch('https://api.mail.hostinger.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`Raw response (status ${res.status}):`);
    console.log(text);
    process.exit(1);
  }

  if (!res.ok) {
    console.error(`Hostinger API error (HTTP ${res.status}):`);
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log('Authenticated account info:');
  console.log(JSON.stringify(data, null, 2));

  const mailboxes = data?.data?.mailboxes || [];
  if (mailboxes.length === 0) {
    console.warn('\n⚠️  No mailboxes found for this API token.');
    console.warn('Make sure the token was generated for an order that has the mailbox you want.');
    process.exit(0);
  }

  console.log('\n==============================');
  console.log('  📬 Available Mailboxes      ');
  console.log('==============================\n');

  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'webadmin@duradata.co.za';
  let match = null;

  mailboxes.forEach((mb, idx) => {
    const isMatch = mb.address?.toLowerCase() === fromEmail.toLowerCase();
    if (isMatch) match = mb;
    console.log(`  [${idx + 1}] Address     : ${mb.address}`);
    console.log(`      Resource ID : ${mb.resourceId || mb.accountResourceId || 'N/A'}`);
    console.log(`      Name        : ${mb.name || '(none)'}`);
    console.log(`      Status      : ${mb.status || 'N/A'}`);
    if (isMatch) console.log(`      ✅  <- MATCHES CONTACT_FROM_EMAIL (${fromEmail})`);
    console.log('');
  });

  if (match) {
    const rid = match.resourceId || match.accountResourceId || '(missing in response)';
    console.log(`✅  Use this resource ID for webadmin@duradata.co.za:`);
    console.log('');
    console.log(`   HOSTINGER_MAILBOX_RESOURCE_ID=${rid}`);
    console.log('');
    console.log('I will now write this to your .env file automatically.');

    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (/^HOSTINGER_MAILBOX_RESOURCE_ID=.*$/m.test(envContent)) {
      envContent = envContent.replace(
        /^HOSTINGER_MAILBOX_RESOURCE_ID=.*$/m,
        `HOSTINGER_MAILBOX_RESOURCE_ID=${rid}`
      );
    } else {
      envContent += `\nHOSTINGER_MAILBOX_RESOURCE_ID=${rid}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅  Updated ${envPath}`);
  } else {
    console.warn(`⚠️  No mailbox matched "${fromEmail}".`);
    console.warn(`Set CONTACT_FROM_EMAIL to one of the addresses listed above, or check your Hostinger order.`);
  }
} catch (err) {
  console.error('Network error:', err.message || err);
  process.exit(1);
}
