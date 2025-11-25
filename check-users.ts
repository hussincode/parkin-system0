import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function checkAllUsers() {
  try {
    await client.connect();
    console.log('Checking all users...\n');
    
    const result = await client.query('SELECT id, username, role FROM users ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found!');
    } else {
      console.log('✅ Found', result.rows.length, 'user(s):\n');
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}, Role: ${user.role}`);
      });
      
      // Check if admin123 is admin
      const admin = result.rows.find(u => u.username === 'admin123');
      if (admin && admin.role === 'admin') {
        console.log('\n✅ admin123 has ADMIN role correctly set');
      } else if (admin) {
        console.log('\n⚠️ admin123 has role:', admin.role, '(should be "admin")');
        console.log('Fixing...');
        await client.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', admin.id]);
        console.log('✅ Fixed! Role updated to "admin"');
      }
    }
    
    await client.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

checkAllUsers();
