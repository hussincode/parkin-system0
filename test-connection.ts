import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://parking_user:1234@localhost:5432/smartparking';

console.log('Connection string:', connectionString);

const client = new Client({
  connectionString,
});

client.connect()
  .then(() => {
    console.log('✅ Connected to database successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    console.error('Make sure:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database "smartparking" exists');
    console.error('3. User "parking_user" exists with password "1234"');
    process.exit(1);
  });
