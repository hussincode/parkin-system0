import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const candidates = [
    path.resolve(__dirname, "public"), // when server is compiled into dist and public is next to it
    path.resolve(__dirname, "../dist/public"), // running from source, root/dist/public
    path.resolve(__dirname, "../client/dist"), // alternative client dist path
    path.resolve(__dirname, "../dist"), // fallback if client output is in dist
  ];

  let distPath: string | undefined = undefined;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      distPath = c;
      break;
    }
  }

  if (!distPath) {
    throw new Error(
      `Could not find the client build. Checked locations: ${candidates.join(", ")}. Run \`npm run build\` at the project root (this runs Vite to build the client into \`dist/public\` and bundles the server into \`dist/index.js\`).`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
