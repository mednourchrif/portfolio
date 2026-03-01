import { connectToDatabase } from './_lib/mongodb.js';
import { hashIP } from './_lib/utils.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const hashedIp = hashIP(ip);

    const { page, referrer, userAgent, language, screenWidth, screenHeight } = req.body;

    // Detect device type
    let device = 'desktop';
    if (screenWidth && screenWidth < 768) device = 'mobile';
    else if (screenWidth && screenWidth < 1024) device = 'tablet';

    // Try to get country from geo headers (Vercel provides these)
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown';

    const { db } = await connectToDatabase();
    await db.collection('visits').insertOne({
      hashedIp,
      page: page || '/',
      referrer: referrer || 'direct',
      userAgent: (userAgent || '').slice(0, 500),
      language: language || 'unknown',
      device,
      screenWidth: screenWidth || 0,
      screenHeight: screenHeight || 0,
      country,
      city,
      createdAt: new Date(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
