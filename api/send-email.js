import { connectToDatabase } from './_lib/mongodb.js';
import { sanitize, isValidEmail, rateLimit } from './_lib/utils.js';

const limiter = rateLimit({ windowMs: 60000, max: 3 });

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit
  if (!limiter(req)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate
    const cleanName = sanitize(name, 100);
    const cleanEmail = sanitize(email, 200);
    const cleanMessage = sanitize(message, 2000);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters.' });
    }

    // Store in database
    const { db } = await connectToDatabase();
    await db.collection('messages').insertOne({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown',
      createdAt: new Date(),
    });

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>',
          to: [process.env.CONTACT_EMAIL || 'contact@mohamed.dev'],
          subject: `Portfolio Contact: ${cleanName}`,
          html: `
            <h2>New Portfolio Message</h2>
            <p><strong>Name:</strong> ${cleanName}</p>
            <p><strong>Email:</strong> ${cleanEmail}</p>
            <p><strong>Message:</strong></p>
            <p>${cleanMessage.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from your portfolio website</p>
          `,
        }),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
