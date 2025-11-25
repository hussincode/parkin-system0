import 'dotenv/config';
import { spawn } from 'child_process';

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL
};

const child = spawn('drizzle-kit', ['push'], {
  stdio: 'inherit',
  shell: true,
  env
});

child.on('exit', (code) => {
  process.exit(code);
});
