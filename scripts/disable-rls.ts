import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://livjynuyaafvijfeaaxe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL or SUPABASE_SERVICE_KEY not set.');
  console.error('Add SUPABASE_SERVICE_KEY to your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function disableRLS() {
  try {
    console.log('Disabling RLS on tables (development only)...\n');

    const sqlStatements = [
      'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.visits DISABLE ROW LEVEL SECURITY;',
    ];

    for (const sql of sqlStatements) {
      console.log(`Running: ${sql}`);
      // Note: Supabase does NOT expose SQL execution via REST API.
      // You must run this manually in the Supabase SQL Editor.
    }

    console.log('\n⚠️  Supabase does not expose SQL execution via REST API.');
    console.log('\nTo disable RLS (development only), go to:');
    console.log('1. Supabase Dashboard → SQL Editor → New Query');
    console.log('2. Paste and run this SQL:\n');
    console.log(sqlStatements.join('\n'));
    console.log('\n⚠️  WARNING: Disabling RLS means anyone can read/write all data.');
    console.log('Use this ONLY in development. Enable RLS with proper policies for production.\n');

    process.exit(0);
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

disableRLS();
