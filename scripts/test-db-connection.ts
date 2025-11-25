import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set in environment.');
    process.exit(2);
  }

  // Prefer reading a CA certificate if provided via NODE_EXTRA_CA_CERTS.
  // Fallback to rejectUnauthorized=false for quick testing only.
  let sslConfig: any;
  if (process.env.NODE_EXTRA_CA_CERTS) {
    if (fs.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
      sslConfig = { ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS).toString() };
    } else {
      console.warn(`NODE_EXTRA_CA_CERTS is set but file not found: ${process.env.NODE_EXTRA_CA_CERTS}. Falling back to insecure test mode.`);
      sslConfig = { rejectUnauthorized: false };
    }
  } else {
    sslConfig = { rejectUnauthorized: false };
  }

  const client = new Client({ connectionString: databaseUrl, ssl: sslConfig });

  try {
    await client.connect();
    console.log('Connected to database. Running test query...');
    const res = await client.query('SELECT now() as now');
    console.log('Query result:', res.rows[0]);
    await client.end();
    process.exit(0);
  } catch (err: any) {
    console.error('Connection test failed:');
    console.error(err.message || err);
    process.exit(1);
  }
}

testConnection();
