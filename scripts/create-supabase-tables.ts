import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://livjynuyaafvijfeaaxe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_KEY not set.');
  console.log('Note: Use the SERVICE ROLE KEY (from Settings > API > Service role key), not the anon key.');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function createTables() {
  try {
    console.log('Creating tables in Supabase...');

    // We'll use raw SQL via the REST API by calling rpc or using a different approach
    // Since we don't have a direct SQL RPC, we need to use the service role to create tables
    // For now, we'll just tell the user to run the SQL manually

    const sql = `
-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text NOT NULL UNIQUE,
  owner_name text NOT NULL,
  qr_value text NOT NULL UNIQUE,
  qr_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id),
  plate_number text NOT NULL,
  owner_name text NOT NULL,
  check_in_time timestamptz NOT NULL DEFAULT now(),
  check_out_time timestamptz,
  duration integer,
  fee integer,
  is_checked_in boolean NOT NULL DEFAULT true
);
    `;

    console.log('⚠️  Supabase does not expose SQL execution via REST API.');
    console.log('\nYou must manually run this SQL in Supabase SQL Editor:');
    console.log('1. Go to your Supabase project → SQL Editor → New Query');
    console.log('2. Paste the following SQL and click Run:\n');
    console.log(sql);
    process.exit(0);
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

createTables();
