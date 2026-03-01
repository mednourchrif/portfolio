/**
 * Local API development server
 * Emulates Vercel serverless functions locally
 * Run with: node server.dev.js
 */

import express from 'express';
import { config } from 'dotenv';
import { pathToFileURL } from 'url';
import path from 'path';

config();

const app = express();
app.use(express.json());

// CORS for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Lazy-load handler at request time so relative imports resolve correctly
function route(filePath) {
  const abs = path.resolve('api', filePath);
  return async (req, res) => {
    try {
      const mod = await import(pathToFileURL(abs).href);
      const handler = mod.default || mod;
      await handler(req, res);
    } catch (err) {
      console.error(`API Error [${filePath}]:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    }
  };
}

// Routes
app.all('/api/send-email', route('send-email.js'));
app.all('/api/chat', route('chat.js'));
app.all('/api/track', route('track.js'));
app.all('/api/auth/login', route('auth/login.js'));
app.all('/api/admin/analytics', route('admin/analytics.js'));
app.all('/api/admin/messages', route('admin/messages.js'));
app.all('/api/admin/chat-logs', route('admin/chat-logs.js'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n  API server running at http://localhost:${PORT}\n`);
});
