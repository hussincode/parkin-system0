import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function checkAdmin() {
  try {
    await client.connect();
    console.log('Checking admin user...');
    
    const result = await client.query(
      'SELECT id, username, role FROM users WHERE username = $1',
      ['admin123']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found!');
    } else {
      const user = result.rows[0];
      console.log('✅ Admin user found:');
      console.log('  ID:', user.id);
      console.log('  Username:', user.username);
      console.log('  Role:', user.role);
      
      if (user.role !== 'admin') {
        console.log('\n⚠️ ERROR: User role is not "admin"!');
        console.log('Fixing the role...');
        await client.query(
          'UPDATE users SET role = $1 WHERE username = $2',
          ['admin', 'admin123']
        );
        console.log('✅ Role updated to "admin"');
      }
    }
    
    await client.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

checkAdmin();
