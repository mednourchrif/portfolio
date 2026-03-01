import { requireAuth } from '../_lib/auth.js';
import { connectToDatabase } from '../_lib/mongodb.js';

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection('chatLogs')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ logs });
  } catch (err) {
    console.error('chat-logs error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler);
