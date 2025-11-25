import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set in environment.');
    process.exit(2);
  }

  // Connect to the existing default database (provided in the URL)
  // Use NODE_EXTRA_CA_CERTS if present for secure CA verification.
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
    console.log('Connected to server. Creating database "system-parking" if it does not exist...');

    // Create database. If it already exists this will throw; we'll catch and ignore that specific error.
    try {
      await client.query('CREATE DATABASE "system-parking"');
      console.log('Database "system-parking" created.');
    } catch (err: any) {
      // Postgres error code 42P04 = duplicate_database
      if (err && err.code === '42P04') {
        console.log('Database "system-parking" already exists, continuing.');
      } else {
        throw err;
      }
    }

    await client.end();

    // Connect to the new database and ensure pgcrypto extension exists
    const newDbUrl = new URL(databaseUrl);
    newDbUrl.pathname = '/system-parking';

    const newClient = new Client({ connectionString: newDbUrl.toString(), ssl: sslConfig });
    await newClient.connect();
    console.log('Connected to "system-parking". Creating extension pgcrypto if missing...');
    await newClient.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('Extension pgcrypto ensured.');
    await newClient.end();

    process.exit(0);
  } catch (err: any) {
    console.error('Failed to create database or extension:');
    console.error(err.message || err);
    try { await client.end(); } catch {};
    process.exit(1);
  }
}

main();
