import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://livjynuyaafvijfeaaxe.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpdmp5bnV5YWFmdmlqZmVhYXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTI1NzEsImV4cCI6MjA3OTUyODU3MX0.LMhWSyfUuAIQj3XIEiQJy2bNYos5mFZdEBxk403BByc';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL or SUPABASE_KEY not set.');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function test() {
  try {
    console.log('Testing Supabase connection to', SUPABASE_URL);

    // Simple check: query current time via SQL or select one row from users
    const { data: sqlNow, error: sqlError } = await supabase.rpc('now');
    if (!sqlError && sqlNow) {
      console.log('RPC now result:', sqlNow);
    } else {
      // If no RPC, try selecting from users table
      const { data, error } = await supabase.from('users').select('id, username').limit(1);
      if (error) {
        console.error('Query error:', error.message || error);
        process.exit(1);
      }
      console.log('Users sample:', data);
    }

    console.log('✅ Supabase connection test finished successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error('Supabase connection test failed:');
    console.error(err.message || err);
    process.exit(1);
  }
}

// Run
test();
