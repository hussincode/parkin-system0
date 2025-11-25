# Smart Parking System - Setup Guide

## Prerequisites

- Node.js (v18+)
- PostgreSQL (local or cloud-based like Neon)
- npm

## Step 1: Create a PostgreSQL Database

### Option A: Using Local PostgreSQL

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Follow the installation wizard
   - Remember the password you set for the `postgres` user

2. **Create a new database**
   - Open PostgreSQL Command Line or pgAdmin
   - Run these commands:
   ```sql
   CREATE DATABASE smartparking;
   ```

3. **Create a database user** (optional, recommended)
   ```sql
   CREATE USER parking_user WITH PASSWORD 'your_password';
   ALTER ROLE parking_user SET client_encoding TO 'utf8';
   ALTER ROLE parking_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE parking_user SET default_transaction_deferrable TO on;
   GRANT ALL PRIVILEGES ON DATABASE smartparking TO parking_user;
   ```

   **Important**: Remember the password you set for `parking_user`. It needs to match the password in your `.env` file.

### Option B: Using Neon Cloud Database

1. **Create a Neon account**
   - Go to: https://neon.tech
   - Sign up (free tier available)

2. **Create a new project and database**
   - Click "New Project"
   - Choose a name (e.g., "smartparking")
   - Select your region
   - Click "Create Project"

3. **Get your connection string**
   - Copy the connection string from the dashboard
   - It should look like: `postgresql://user:password@your-db-host.neon.tech/smartparking?sslmode=require`

## Step 2: Update Environment Variables

1. **Open `.env.local` file** in the project root

2. **Replace the DATABASE_URL with your actual connection string**

   **For Local PostgreSQL:**
   ```
   DATABASE_URL=postgresql://parking_user:your_password@localhost:5432/smartparking
   ```
   
   **For Neon:**
   ```
   DATABASE_URL=postgresql://user:password@your-db-host.neon.tech/smartparking?sslmode=require
   ```

3. **Save the file**

## Step 3: Install Dependencies

Run the following command in the project root:

```bash
npm install
```

## Step 4: Initialize the Database Schema

The project uses Drizzle ORM. Run the migration to create all necessary tables:

```bash
npm run db:push
```

This will:
- Create the `users` table
- Create the `cars` table
- Create the `visits` table
- Set up all required columns and relationships

## Step 5: Run the Development Server

Start the development server with:

```bash
npm run dev
```

The server will start on port 5000 (or the port specified in the `PORT` environment variable).

You should see output like:
```
[Time] [express] serving on port 5000
```

## Step 6: Access the Application

- **Frontend**: Open http://localhost:5000 in your browser
- **API**: The Express server serves both the API and the frontend

**Note**: On the first run, you may see a PostCSS warning - this is non-critical and won't affect functionality.

## Troubleshooting

### Error: "DATABASE_URL must be set"

**Solution**: Ensure `.env.local` file exists in the project root with a valid `DATABASE_URL`

### Error: "connect ECONNREFUSED"

**For Local PostgreSQL**:
- Check if PostgreSQL service is running
- Windows: Open Services (services.msc) and look for "postgresql-x64-xx"
- Verify the connection string has correct host, port, and credentials

**For Neon**:
- Check your internet connection
- Verify the connection string is correct
- Ensure your Neon project is not paused

### Error: Database operations fail

**Solution**: Run the migration again:
```bash
npm run db:push
```

## Project Structure

```
.
├── client/              # React frontend (Vite)
├── server/              # Express backend
│   ├── app.ts          # Express app configuration
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   └── index-dev.ts    # Development entry point
├── shared/              # Shared types and schemas
│   └── schema.ts       # Drizzle ORM schema
├── .env.local          # Environment variables (local)
├── package.json        # Project dependencies
└── drizzle.config.ts   # Drizzle ORM configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Run database migrations

## Database Schema

The application uses the following tables:

### users
- `id` (UUID, primary key)
- `username` (string, unique)
- `password` (string, hashed)
- Other user-related fields

### cars
- `id` (UUID, primary key)
- `plateNumber` (string, unique)
- `qrValue` (string, unique)
- `qrCode` (string)
- `ownerName` (string)
- Other car-related fields

### visits
- `id` (UUID, primary key)
- `carId` (UUID, foreign key)
- `plateNumber` (string)
- `ownerName` (string)
- `checkInTime` (timestamp)
- `checkOutTime` (timestamp, nullable)
- `duration` (integer, nullable)
- `fee` (decimal, nullable)
- `isCheckedIn` (boolean)

## Next Steps

1. Configure your database connection (follow Step 1 & 2)
2. Install dependencies (Step 3)
3. Push the database schema (Step 4)
4. Start the development server (Step 5)
5. Begin developing!

For more information, check the design guidelines in `design_guidelines.md`.
