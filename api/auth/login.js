import bcrypt from 'bcryptjs';
import { signToken } from '../_lib/auth.js';
import { rateLimit } from '../_lib/utils.js';

const limiter = rateLimit({ windowMs: 300000, max: 5 }); // 5 attempts per 5 minutes

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!limiter(req)) {
    return res.status(429).json({ error: 'Too many login attempts' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminPasswordHash) {
      return res.status(500).json({ error: 'Admin not configured' });
    }

    const isValid = await bcrypt.compare(password, adminPasswordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ role: 'admin' }, '24h');

    // Set httpOnly cookie as backup
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
