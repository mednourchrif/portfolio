import { rateLimit } from './_lib/utils.js';
import { connectToDatabase } from './_lib/mongodb.js';

const limiter = rateLimit({ windowMs: 60000, max: 10 });

function getAIProvider() {
  const explicitProvider = (process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (explicitProvider) return explicitProvider;

  if (process.env.LLAMA_API_KEY) return 'llama';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';

  return null;
}

const SYSTEM_PROMPT = `You are the AI assistant for Mohamed Nour Cherif's portfolio website. You speak in first person about Mohamed as if you are his representative.

About Mohamed:
- Full-stack developer specializing in Web, Mobile, and AI
- Proficient in React, Next.js, Vue.js, Node.js, Python, TypeScript
- Mobile: React Native, Flutter, Swift
- AI/ML: OpenAI API, TensorFlow, PyTorch
- DevOps: Docker, Vercel, AWS, Linux
- Database: PostgreSQL, MongoDB, Redis
- GitHub: https://github.com/mednourchrif

Key traits:
- Passionate about clean architecture and scalable systems
- Focused on AI-powered applications
- Strong in both frontend design and backend engineering
- Open to freelance projects and full-time opportunities

Respond helpfully and concisely. Keep answers professional and focused on Mohamed's skills and experience. Be friendly but not overly casual. If asked anything unrelated, politely redirect to Mohamed's professional profile. Do not make up specific project details or dates.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!limiter(req)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages required' });
    }

    // Limit context window
    const recentMessages = messages.slice(-10);

    const provider = getAIProvider();
    if (!provider) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Store chat log
    try {
      const { db } = await connectToDatabase();
      await db.collection('chatLogs').insertOne({
        messages: recentMessages,
        createdAt: new Date(),
        ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown',
      });
    } catch {
      // Don't fail if DB logging fails
    }

    if (provider === 'anthropic') {
      // Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          stream: true,
          messages: recentMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Anthropic API error: ${text}`);
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'content_block_delta' && data.delta?.text) {
                res.write(`data: ${JSON.stringify({ token: data.delta.text })}\n\n`);
              }
            } catch {
              // skip
            }
          }
        }
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    }

    if (provider === 'llama') {
      if (!process.env.LLAMA_API_KEY) {
        return res.status(500).json({ error: 'LLAMA_API_KEY is missing' });
      }

      const llamaBaseUrl = (process.env.LLAMA_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
      const llamaModel = process.env.LLAMA_MODEL || 'meta-llama/llama-3.1-8b-instruct';

      const extraHeaders =
        llamaBaseUrl.includes('openrouter.ai')
          ? {
              'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5173',
              'X-Title': 'Mohamed Portfolio AI',
            }
          : {};

      const response = await fetch(`${llamaBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LLAMA_API_KEY}`,
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
        body: JSON.stringify({
          model: llamaModel,
          stream: true,
          max_tokens: 500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages,
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Llama API error: ${text}`);
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
              }
            } catch {
              // skip
            }
          }
        }
      }

      return res.end();
    }

    if (provider === 'openai') {
      // OpenAI API
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is missing' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          stream: true,
          max_tokens: 500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages,
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI API error: ${text}`);
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
              }
            } catch {
              // skip
            }
          }
        }
      }

      return res.end();
    }

    return res.status(500).json({ error: `Unsupported AI_PROVIDER: ${provider}` });
  } catch (err) {
    console.error('chat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
