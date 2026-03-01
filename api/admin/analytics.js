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

    // Total visits
    const totalVisitors = await db.collection('visits').countDocuments();

    // Unique visitors
    const uniqueResult = await db.collection('visits').aggregate([
      { $group: { _id: '$hashedIp' } },
      { $count: 'count' },
    ]).toArray();
    const uniqueVisitors = uniqueResult[0]?.count || 0;

    // Daily visits (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyVisits = await db.collection('visits').aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', visits: 1, _id: 0 } },
    ]).toArray();

    // Device breakdown
    const deviceBreakdown = await db.collection('visits').aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]).toArray();

    const totalDevices = deviceBreakdown.reduce((a, b) => a + b.count, 0) || 1;
    const devices = deviceBreakdown.map((d) => ({
      name: (d._id || 'Unknown').charAt(0).toUpperCase() + (d._id || 'unknown').slice(1),
      value: Math.round((d.count / totalDevices) * 100),
    }));

    // Top countries
    const topCountries = await db.collection('visits').aggregate([
      { $group: { _id: '$country', visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: 5 },
      { $project: { country: '$_id', visits: 1, _id: 0 } },
    ]).toArray();

    return res.status(200).json({
      totalVisitors,
      uniqueVisitors,
      dailyVisits,
      devices,
      topCountries,
    });
  } catch (err) {
    console.error('analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler);
