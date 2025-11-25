import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Creating tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');
    
    // Create cars table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        plate_number TEXT NOT NULL UNIQUE,
        owner_name TEXT NOT NULL,
        qr_value TEXT NOT NULL UNIQUE,
        qr_code TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Cars table created');
    
    // Create visits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        car_id VARCHAR(255) NOT NULL REFERENCES cars(id),
        plate_number TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        check_in_time TIMESTAMP NOT NULL DEFAULT NOW(),
        check_out_time TIMESTAMP,
        duration INTEGER,
        fee INTEGER,
        is_checked_in BOOLEAN NOT NULL DEFAULT true
      );
    `);
    console.log('✅ Visits table created');
    
    console.log('✅ All tables created successfully!');
    await client.end();
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('✅ Tables already exist');
      await client.end();
    } else {
      console.error('❌ Error creating tables:', error.message);
      await client.end();
      process.exit(1);
    }
  }
}

createTables();
