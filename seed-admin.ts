import 'dotenv/config';
import fs from 'fs';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;
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

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

async function seedAdmin() {
  try {
    await client.connect();
    console.log('Connected to database...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    
    // Insert admin user
    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role;
    `;
    
    const result = await client.query(query, ['admin123', hashedPassword, 'admin']);
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin123');
    console.log('Password: admin@123');
    console.log('Role: admin');
    console.log('User ID:', result.rows[0]?.id);
    
    await client.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.log('⚠️  Admin user already exists!');
      await client.end();
      process.exit(0);
    }
    console.error('❌ Error creating admin user:', error.message);
    await client.end();
    process.exit(1);
  }
}

seedAdmin();
