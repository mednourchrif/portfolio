const rateLimitMap = new Map();

export function rateLimit({ windowMs = 60000, max = 10 } = {}) {
  return (req) => {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      'unknown';

    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter((t) => t > windowStart);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
      for (const [key, val] of rateLimitMap) {
        const filtered = val.filter((t) => t > windowStart);
        if (filtered.length === 0) rateLimitMap.delete(key);
        else rateLimitMap.set(key, filtered);
      }
    }

    return timestamps.length <= max;
  };
}

export function sanitize(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '');
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hashIP(ip) {
  // Simple hash for privacy
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
