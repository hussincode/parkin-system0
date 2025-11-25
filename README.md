# SmartParkingSystem — Fullstack (Client + Server)

This repository contains a React client (`client/`) and a TypeScript Express backend (`server/`). This README explains how to install the packages required to run the system, how to build and run locally, and basic deployment notes.

## Prerequisites
- Node.js >= 18
- npm (comes with Node) or `pnpm`/`yarn` if you prefer

## Install packages (recommended)
Install everything at once from the repo root (this reads the top-level `package.json` and installs client + server deps):

```powershell
cd "<repo-root>"
npm install
```

Alternatively install only the server or client dependencies:

```powershell
cd server
npm install
# and (optional) for client
cd ..\client
npm install
```

Notes:
- The root `package.json` already lists both client and shared dependencies and dev deps used for building the app.
- On deployment platforms you usually only need the `server/` folder (or point the platform to `server/package.json`) — `server/package.json` contains a `postinstall` that runs `npm run build` and emits `dist/`.

## Core packages used (high level)
You don't need to manually install these if you ran `npm install` above — they are listed here for reference.

- Server (backend) highlights: `express`, `express-session`, `cors`, `pg`, `connect-pg-simple`, `qrcode`, `bcryptjs`, `exceljs`, `drizzle-orm` (DB tooling), `dotenv`.
- Client (frontend) highlights: `react`, `react-dom`, `@tanstack/react-query`, `zod`, Tailwind + related UI libs.

## Build & Run locally
1. Build the client and server (from repo root):

```powershell
npm run build
```

This runs the root `build` script which builds the client (Vite) and bundles server entry for production.

2. Run the production server:

```powershell
npm start
```

3. For development (hot reload):

```powershell
npm run dev
```

4. Or run server-only dev (inside `server`):

```powershell
cd server
npm run dev
```

## Environment variables
Set these in your local `.env` (not checked in) or in your deployment platform:

- `DATABASE_URL` (or `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`)
- `SESSION_SECRET` (used for express-session)
- `PORT` (optional)

## Deploy notes (Railway / Vercel)
- For a simple backend deploy, point the platform to the `server/` folder so it finds `server/package.json`.
- `server/package.json` includes:
  - `postinstall: npm run build` (builds TypeScript into `dist` during install)
  - `start: node dist/index-prod.js` (runs compiled server)
- Make sure environment variables are configured in the platform.

## Troubleshooting
- If the build fails, run `npm run build` locally and inspect TypeScript/Vite errors.
- If you see path errors on deployment (e.g. `fsPath` or `import.meta.dirname`), ensure you are using the repository's latest code — this repository uses `fileURLToPath(import.meta.url)` to compute `__dirname` for ESM portability.

## If you want a minimal deploy folder
I can create a `project/` folder that contains only the runtime artifacts (compiled `dist/` server files, `server.js`, and a minimal `package.json`) so you can push that single folder to Vercel or other simple hosts. Tell me if you want that and I'll generate it.

---

If you'd like I can also commit this README and the small `project/` bundle to a branch and prepare a `vercel.json` for you.
